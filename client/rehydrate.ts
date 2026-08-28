import { BeaconSystem, ErrorKey, ErrorSystemConfig } from "../registry";

/** Category/code value used when wire codes don't resolve against the registry. */
export const UNKNOWN = "UNKNOWN";

/**
 * A server beacon error rehydrated into an `Error` instance on the client.
 *
 * Carries the org-defined category and code names, resolved from the numeric
 * wire codes via the shared registry, alongside the raw wire values, plus
 * `docsUrl` and `httpStatus` from the registry definition.
 */
export class BeaconClientError<
  Key extends string = string,
  Cat extends string = string,
  Code extends string = string
> extends Error {
  /** Resolved category name, or "UNKNOWN" if the super code isn't in the registry. */
  readonly category: Cat | typeof UNKNOWN;

  /** Resolved sub-code name, or "UNKNOWN" if the sub-code isn't in the registry. */
  readonly code: Code | typeof UNKNOWN;

  /** Raw numeric `super_code` from the wire. */
  readonly superCode: number;

  /** Raw formatted `sub_code` from the wire, e.g. "PAY-001". */
  readonly subCode: string;

  /** Numeric part of the sub-code, or `null` if it couldn't be parsed. */
  readonly subCodeNumber: number | null;

  /** HTTP status the registry associates with this category, if resolved. */
  readonly httpStatus?: number;

  /** Documentation link from the registry definition, if any. */
  readonly docsUrl?: string;

  readonly timestamp?: string;
  readonly meta?: Record<string, any>;

  /** Present when the server error originated from an upstream service failure. */
  readonly originalError?: string;

  constructor(params: {
    message: string;
    category: Cat | typeof UNKNOWN;
    code: Code | typeof UNKNOWN;
    superCode: number;
    subCode: string;
    subCodeNumber: number | null;
    httpStatus?: number;
    docsUrl?: string;
    timestamp?: string;
    meta?: Record<string, any>;
    originalError?: string;
  }) {
    super(params.message);
    this.name = "BeaconClientError";
    this.category = params.category;
    this.code = params.code;
    this.superCode = params.superCode;
    this.subCode = params.subCode;
    this.subCodeNumber = params.subCodeNumber;
    this.httpStatus = params.httpStatus;
    this.docsUrl = params.docsUrl;
    this.timestamp = params.timestamp;
    this.meta = params.meta;
    this.originalError = params.originalError;
  }

  /**
   * Checks this error against a `"CATEGORY.SUB_CODE"` key from the registry.
   *
   * @example
   * if (err.is("WALLET.FROZEN")) showUnfreezeModal();
   */
  is(key: Key): boolean {
    return `${this.category}.${this.code}` === key;
  }
}

type CategoryOf<C extends ErrorSystemConfig> = keyof C["categories"] & string;

type SubCodeOf<C extends ErrorSystemConfig> = {
  [Cat in CategoryOf<C>]: keyof C["categories"][Cat]["subCodes"] & string;
}[CategoryOf<C>];

/**
 * The fully-typed error `parse` produces for a given config: `category`,
 * `code`, and `is()` all narrow to the names declared in the registry.
 */
export type ParsedError<C extends ErrorSystemConfig> = BeaconClientError<ErrorKey<C>, CategoryOf<C>, SubCodeOf<C>>;

type SubCodeHandlers<C extends ErrorSystemConfig, Cat extends CategoryOf<C>, T> = {
  [Sub in keyof C["categories"][Cat]["subCodes"]]?: (err: ParsedError<C>) => T;
} & {
  /** Fallback for sub-codes in this category without their own handler. */
  _?: (err: ParsedError<C>) => T;
};

/**
 * Handlers for `match`: per category, either one function for the whole
 * category or a map of per-sub-code handlers with an optional `_` fallback.
 * The top-level `_` catches unmatched categories and non-beacon errors (`null`).
 */
export type BeaconMatchHandlers<C extends ErrorSystemConfig, T> = {
  [Cat in CategoryOf<C>]?: ((err: ParsedError<C>) => T) | SubCodeHandlers<C, Cat, T>;
} & {
  _?: (err: ParsedError<C> | null) => T;
};

export interface BeaconClient<C extends ErrorSystemConfig> {
  /**
   * Parses an unknown HTTP response body into a `BeaconClientError`, or `null`
   * if the body is not beacon-shaped. Wire codes the registry doesn't know
   * (e.g. the server added codes before the client updated) still parse, with
   * `category`/`code` set to "UNKNOWN".
   */
  parse(body: unknown): ParsedError<C> | null;

  /**
   * Dispatches a parsed error to the matching handler. Sub-code handlers take
   * precedence over the category `_` fallback, which takes precedence over the
   * top-level `_`. Handlers can be sync or async, and the return type is
   * inferred from the handlers.
   */
  match<T>(err: ParsedError<C> | null, handlers: BeaconMatchHandlers<C, T>): T | undefined;

  /**
   * Parses a response body and dispatches it to the matching handler in one call.
   *
   * @example
   * client.handle(await response.json(), {
   *   WALLET: { FROZEN: () => showUnfreezeModal() },
   *   _: () => toast.error("Something went wrong"),
   * });
   */
  handle<T>(body: unknown, handlers: BeaconMatchHandlers<C, T>): T | undefined;

  /** Parses a response body and checks it against one key in a single call. */
  is(body: unknown, key: ErrorKey<C>): boolean;
}

const SUB_CODE_PATTERN = /^([A-Z]+)-(\d+)$/;

/**
 * Binds client-side parsing and matching to an error system created with
 * `defineErrorSystem`. Import the same shared config module the server uses.
 *
 * ```ts
 * import { createBeaconClient } from "rise-beacon/client";
 * import { beacon } from "./errors.config";
 *
 * const client = createBeaconClient(beacon);
 *
 * const err = client.parse(await response.json());
 * client.match(err, {
 *   WALLET: { FROZEN: () => showUnfreezeModal(), _: (e) => toast.error(e.message) },
 *   VALIDATION: (e) => toast.error(e.message),
 *   _: () => toast.error("Something went wrong"),
 * });
 * ```
 */
export function createBeaconClient<C extends ErrorSystemConfig>(system: BeaconSystem<C>): BeaconClient<C> {
  function parse(body: unknown): ParsedError<C> | null {
    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as any).message !== "string" ||
      typeof (body as any).data !== "object" ||
      (body as any).data === null
    ) {
      return null;
    }

    const { message, data, original_error } = body as any;

    if (typeof data.super_code !== "number" || typeof data.sub_code !== "string") {
      return null;
    }

    const subCodeMatch = SUB_CODE_PATTERN.exec(data.sub_code);
    const subCodeNumber = subCodeMatch ? parseInt(subCodeMatch[2], 10) : null;
    const resolved = subCodeNumber === null ? null : system.resolve(data.super_code, subCodeNumber);

    return new BeaconClientError<ErrorKey<C>, CategoryOf<C>, SubCodeOf<C>>({
      message,
      category: (resolved?.category as CategoryOf<C> | undefined) ?? UNKNOWN,
      code: (resolved?.code as SubCodeOf<C> | undefined) ?? UNKNOWN,
      superCode: data.super_code,
      subCode: data.sub_code,
      subCodeNumber,
      httpStatus: resolved?.httpStatus,
      docsUrl: resolved?.definition.docsUrl,
      ...(typeof data.timestamp === "string" && { timestamp: data.timestamp }),
      ...(data.meta && { meta: data.meta }),
      ...(typeof original_error === "string" && { originalError: original_error })
    });
  }

  function match<T>(err: ParsedError<C> | null, handlers: BeaconMatchHandlers<C, T>): T | undefined {
    const fallback = handlers._;
    if (err === null) {
      return fallback?.(null);
    }

    const categoryHandler = (handlers as Record<string, unknown>)[err.category];
    if (typeof categoryHandler === "function") {
      return (categoryHandler as (e: ParsedError<C>) => T)(err);
    }
    if (categoryHandler && typeof categoryHandler === "object") {
      const subHandlers = categoryHandler as Record<string, ((e: ParsedError<C>) => T) | undefined>;
      const subHandler = subHandlers[err.code] ?? subHandlers._;
      if (subHandler) {
        return subHandler(err);
      }
    }

    return fallback?.(err);
  }

  function handle<T>(body: unknown, handlers: BeaconMatchHandlers<C, T>): T | undefined {
    return match(parse(body), handlers);
  }

  function is(body: unknown, key: ErrorKey<C>): boolean {
    return parse(body)?.is(key) ?? false;
  }

  return { parse, match, handle, is };
}
