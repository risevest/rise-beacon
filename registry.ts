import { BeaconError } from "./errors";
import { ErrorSystem } from "./error.model";
import {
  AuthenticationSubCodes,
  AuthorizationSubCodes,
  BusinessLogicSubCodes,
  ExternalServiceSubCodes,
  SuperErrorCodes,
  SystemSubCodes,
  ValidationSubCodes,
  authenticationErrors,
  authorizationErrors,
  businessLogicErrors,
  externalServiceErrors,
  systemErrors,
  validationErrors
} from "./classification";

/**
 * A single error case inside a category.
 */
export interface SubCodeDefinition {
  /**
   * Numeric wire value, serialized as "PREFIX-NNN".
   * Explicit (not auto-incremented) so renaming a key never shifts the code on the wire.
   */
  code: number;

  /** Default human-readable message for this error. */
  message: string;

  /** HTTP status for this specific code, overriding the category's (e.g. a 404 inside a 422 category). */
  httpStatus?: number;

  /** Optional link to documentation for this error case. */
  docsUrl?: string;
}

/**
 * A category of errors sharing one `super_code`.
 */
export interface CategoryDefinition {
  /** Numeric wire value sent as `super_code`. */
  superCode: number;

  /** HTTP status the middleware responds with for this category. Defaults to 500. */
  httpStatus?: number;

  /** Named error cases within this category. */
  subCodes: Record<string, SubCodeDefinition>;
}

/**
 * Configuration for an organization's error system.
 * Define it once in a shared module and import it from both server and client code.
 */
export interface ErrorSystemConfig {
  /** Service prefix used in serialized sub-codes, e.g. "PAY" → "PAY-001". */
  prefix: string;

  /** Error categories keyed by name. Spread `beaconDefaultCategories` in to include the built-in taxonomy. */
  categories: Record<string, CategoryDefinition>;
}

/**
 * Options object accepted by error factories and helpers, as an alternative
 * to positional arguments. Allows passing `meta` without a `undefined` message.
 *
 * @example
 * system.errors.WALLET.FROZEN({ meta: { walletId } });
 */
export interface BeaconErrorOptions {
  message?: string;
  meta?: Record<string, any>;
}

/**
 * Creates a `BeaconError` for one specific category and sub-code.
 * Accepts either positional arguments `(message?, meta?)` or a
 * `BeaconErrorOptions` object.
 */
export type BeaconErrorFactory = (
  messageOrOptions?: string | BeaconErrorOptions,
  meta?: Record<string, any>
) => BeaconError;

/**
 * Nested factories derived from a config: `system.errors.CATEGORY.SUB_CODE(...)`.
 */
export type ErrorFactories<C extends ErrorSystemConfig> = {
  [Cat in keyof C["categories"]]: {
    [Sub in keyof C["categories"][Cat]["subCodes"]]: BeaconErrorFactory;
  };
};

/**
 * Union of `"CATEGORY.SUB_CODE"` keys for a config, used by typed
 * lookups such as `system.throw(key)` and `err.is(key)`.
 */
export type ErrorKey<C extends ErrorSystemConfig> = {
  [Cat in keyof C["categories"] & string]: `${Cat}.${keyof C["categories"][Cat]["subCodes"] & string}`;
}[keyof C["categories"] & string];

/**
 * Result of reverse-looking-up numeric wire codes back to their names.
 */
export interface ResolvedCode {
  category: string;
  code: string;
  definition: SubCodeDefinition;
  superCode: number;
  httpStatus: number;
}

/**
 * The runtime object returned by `defineErrorSystem`.
 * Server code throws via `errors`; client code resolves wire codes via `resolve`.
 */
export interface BeaconSystem<C extends ErrorSystemConfig = ErrorSystemConfig> {
  config: C;
  prefix: string;

  /** Typed error factories: `throw system.errors.WALLET.FROZEN("msg", { meta })`. */
  errors: ErrorFactories<C>;

  /**
   * Creates the error for a `"CATEGORY.SUB_CODE"` key without throwing it.
   * Useful for `Promise.reject`, or where an explicit `throw` statement is
   * needed for control flow analysis.
   *
   * @example
   * throw system.error("WALLET.FROZEN");
   */
  error(key: ErrorKey<C>, messageOrOptions?: string | BeaconErrorOptions, meta?: Record<string, any>): BeaconError;

  /**
   * Throws the error for a key.
   *
   * @example
   * system.throw("WALLET.FROZEN");
   */
  throw(key: ErrorKey<C>, messageOrOptions?: string | BeaconErrorOptions, meta?: Record<string, any>): never;

  /**
   * Throws the error for a key when `condition` is falsy.
   *
   * Does not narrow the condition's type: TypeScript only applies `asserts`
   * narrowing to explicitly annotated call targets (TS2775), which an inferred
   * `const system = defineErrorSystem(...)` is not. When a value must exist,
   * prefer `orThrow`, which narrows through its return type.
   *
   * @example
   * system.assert(!wallet.frozen, "WALLET.FROZEN", { meta: { walletId } });
   */
  assert(
    condition: unknown,
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): void;

  /**
   * Returns `value`, or throws the error for a key when the value is `null`
   * or `undefined`. The return type is narrowed to `NonNullable<T>`.
   *
   * @example
   * const wallet = system.orThrow(await findWallet(id), "VALIDATION.RESOURCE_NOT_FOUND");
   */
  orThrow<T>(
    value: T,
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): NonNullable<T>;

  /** HTTP status for a super code. Falls back to 500 for unknown codes. */
  httpStatusFor(superCode: number): number;

  /** Reverse lookup: numeric super/sub codes → names + definition, or `null` if unknown. */
  resolve(superCode: number, subCode: number): ResolvedCode | null;
}

/**
 * Defines an organization's error system: categories, sub-codes, messages, and HTTP statuses.
 *
 * The config is shared by server and client. Category and sub-code names are
 * preserved at the type level, so factories, `parse`, `match`, and `is` all
 * autocomplete against it.
 *
 * Duplicate super codes across categories, or duplicate sub-code numbers within a
 * category, throw at definition time.
 *
 * @example
 * export const beacon = defineErrorSystem({
 *   prefix: "PAY",
 *   categories: {
 *     ...beaconDefaultCategories, // optional built-in 1000–6000 taxonomy
 *     WALLET: {
 *       superCode: 7000,
 *       httpStatus: 422,
 *       subCodes: {
 *         FROZEN: { code: 1, message: "Wallet is frozen" },
 *         LIMIT_EXCEEDED: { code: 2, message: "Wallet limit exceeded" }
 *       }
 *     }
 *   }
 * });
 *
 * // server
 * throw beacon.errors.WALLET.FROZEN();
 */
export function defineErrorSystem<const C extends ErrorSystemConfig>(config: C): BeaconSystem<C> {
  const superCodeOwner = new Map<number, string>();
  const bySuperCode = new Map<number, { name: string; def: CategoryDefinition; subNames: Map<number, string> }>();
  const errors = {} as Record<string, Record<string, BeaconErrorFactory>>;
  const factoryByKey = new Map<string, BeaconErrorFactory>();

  for (const [categoryName, category] of Object.entries(config.categories)) {
    if (categoryName.includes(".")) {
      throw new Error(`[rise-beacon] Category name "${categoryName}" must not contain "." (reserved for error keys).`);
    }
    const owner = superCodeOwner.get(category.superCode);
    if (owner) {
      throw new Error(
        `[rise-beacon] Duplicate super code ${category.superCode}: used by both "${owner}" and "${categoryName}".`
      );
    }
    superCodeOwner.set(category.superCode, categoryName);

    const subNames = new Map<number, string>();
    const factories: Record<string, BeaconErrorFactory> = {};

    for (const [codeName, sub] of Object.entries(category.subCodes)) {
      if (codeName.includes(".")) {
        throw new Error(
          `[rise-beacon] Sub-code name "${codeName}" in category "${categoryName}" must not contain "." (reserved for error keys).`
        );
      }
      const dup = subNames.get(sub.code);
      if (dup) {
        throw new Error(
          `[rise-beacon] Duplicate sub code ${sub.code} in category "${categoryName}": used by both "${dup}" and "${codeName}".`
        );
      }
      subNames.set(sub.code, codeName);

      const factory: BeaconErrorFactory = (messageOrOptions?: string | BeaconErrorOptions, meta?: Record<string, any>) => {
        const opts =
          typeof messageOrOptions === "object" && messageOrOptions !== null
            ? messageOrOptions
            : { message: messageOrOptions, meta };
        return new BeaconError({
          categoryName,
          codeName,
          superCode: category.superCode,
          subCode: sub.code,
          httpStatus: sub.httpStatus ?? category.httpStatus ?? 500,
          message: opts.message ?? sub.message,
          prefix: config.prefix,
          docsUrl: sub.docsUrl,
          meta: opts.meta
        });
      };

      factories[codeName] = factory;
      factoryByKey.set(`${categoryName}.${codeName}`, factory);
    }

    bySuperCode.set(category.superCode, { name: categoryName, def: category, subNames });
    errors[categoryName] = factories;
  }

  function createError(
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): BeaconError {
    const factory = factoryByKey.get(key);
    if (!factory) {
      throw new Error(`[rise-beacon] Unknown error key "${key}". Expected "CATEGORY.SUB_CODE" from this system's config.`);
    }
    return factory(messageOrOptions, meta);
  }

  function throwError(
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): never {
    throw createError(key, messageOrOptions, meta);
  }

  function assertCondition(
    condition: unknown,
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): void {
    if (!condition) {
      throwError(key, messageOrOptions, meta);
    }
  }

  function orThrow<T>(
    value: T,
    key: ErrorKey<C>,
    messageOrOptions?: string | BeaconErrorOptions,
    meta?: Record<string, any>
  ): NonNullable<T> {
    if (value === null || value === undefined) {
      throwError(key, messageOrOptions, meta);
    }
    return value as NonNullable<T>;
  }

  return {
    config,
    prefix: config.prefix,
    errors: errors as ErrorFactories<C>,
    error: createError,
    throw: throwError,
    assert: assertCondition,
    orThrow,
    httpStatusFor(superCode: number): number {
      return bySuperCode.get(superCode)?.def.httpStatus ?? 500;
    },
    resolve(superCode: number, subCode: number): ResolvedCode | null {
      const category = bySuperCode.get(superCode);
      if (!category) return null;

      const codeName = category.subNames.get(subCode);
      if (!codeName) return null;

      const definition = category.def.subCodes[codeName];
      return {
        category: category.name,
        code: codeName,
        definition,
        superCode,
        httpStatus: definition.httpStatus ?? category.def.httpStatus ?? 500
      };
    }
  };
}

type SubCodesFromEnum<E> = {
  [K in keyof E as E[K] extends number ? K : never]: SubCodeDefinition;
};

function subCodesFromEnum<E extends Record<string, string | number>>(
  enumObject: E,
  definitions: ErrorSystem,
  fallbackMessage: string,
  statusOverrides?: Partial<Record<keyof E, number>>
): SubCodesFromEnum<E> {
  const subCodes: Record<string, SubCodeDefinition> = {};
  for (const [name, value] of Object.entries(enumObject)) {
    if (typeof value !== "number") continue; // skip numeric-enum reverse mappings
    const httpStatus = statusOverrides?.[name];
    subCodes[name] = {
      code: value,
      message: definitions[value]?.description ?? fallbackMessage,
      ...(httpStatus !== undefined && { httpStatus })
    };
  }
  return subCodes as SubCodesFromEnum<E>;
}

/**
 * The built-in taxonomy (super codes 1000-6000) expressed as registry categories.
 * Spread into `defineErrorSystem` to combine it with org-defined categories.
 *
 * @example
 * defineErrorSystem({
 *   prefix: "PAY",
 *   categories: { ...beaconDefaultCategories, WALLET: { ... } }
 * });
 */
export const beaconDefaultCategories = {
  VALIDATION: {
    superCode: SuperErrorCodes.VALIDATION_ERROR as number,
    httpStatus: 422,
    subCodes: subCodesFromEnum(ValidationSubCodes, validationErrors, "Validation failed", {
      RESOURCE_NOT_FOUND: 404
    })
  },
  AUTHENTICATION: {
    superCode: SuperErrorCodes.AUTHENTICATION_ERROR as number,
    httpStatus: 401,
    subCodes: subCodesFromEnum(AuthenticationSubCodes, authenticationErrors, "Authentication failed")
  },
  AUTHORIZATION: {
    superCode: SuperErrorCodes.AUTHORIZATION_ERROR as number,
    httpStatus: 403,
    subCodes: subCodesFromEnum(AuthorizationSubCodes, authorizationErrors, "Authorization failed", {
      RATE_LIMIT: 429
    })
  },
  BUSINESS_LOGIC: {
    superCode: SuperErrorCodes.BUSINESS_LOGIC_ERROR as number,
    httpStatus: 422,
    subCodes: subCodesFromEnum(BusinessLogicSubCodes, businessLogicErrors, "Business logic error", {
      RESOURCE_NOT_FOUND: 404,
      RATE_LIMIT_EXCEEDED: 429
    })
  },
  EXTERNAL_SERVICE: {
    superCode: SuperErrorCodes.EXTERNAL_SERVICE_ERROR as number,
    httpStatus: 502,
    subCodes: subCodesFromEnum(ExternalServiceSubCodes, externalServiceErrors, "External service error")
  },
  SYSTEM: {
    superCode: SuperErrorCodes.SYSTEM_ERROR as number,
    httpStatus: 500,
    subCodes: subCodesFromEnum(SystemSubCodes, systemErrors, "System error")
  }
} satisfies ErrorSystemConfig["categories"];
