import {
  AllSubCodes,
  authenticationErrors,
  AuthenticationSubCodes,
  authorizationErrors,
  AuthorizationSubCodes,
  businessLogicErrors,
  BusinessLogicSubCodes,
  externalServiceErrors,
  ExternalServiceSubCodes,
  SuperErrorCodes,
  systemErrors,
  SystemSubCodes,
  validationErrors,
  ValidationSubCodes,
  ServiceSubCode, ServiceCodePrefix
} from "./classification";
import { SerializedError } from "./error.model";
import { ErrorUtils } from "./error-utils";

let CURRENT_SERVICE_PREFIX: ServiceCodePrefix = "GEN";
let isServicePrefixSet = false;

export function setServicePrefix(prefix: ServiceCodePrefix) {
  if (isServicePrefixSet) {
    console.warn(`[Warning] Service prefix already set to "${CURRENT_SERVICE_PREFIX}". Ignoring new value "${prefix}".`);
    return;
  }
  CURRENT_SERVICE_PREFIX = prefix;
  isServicePrefixSet = true;
}

/**
 * Represents a structured application error for consistent error responses.
 *
 * This class is used to encapsulate application-level error information,
 * including categorized codes, optional metadata, and timestamp for traceability.
 */
export class AppError extends Error {
  /**
   * Broad category of the error (used for grouping).
   * Should match a key in the `SuperErrorCodes` enum.
   */
  readonly superCode: SuperErrorCodes;

  /**
   * Specific error detail within the category.
   * Should match a key in a subcode enum (e.g., `ValidationSubCodes`).
   */
  readonly subCode: AllSubCodes;

  /**
   * ISO timestamp of when the error occurred.
   */
  readonly timestamp: string = new Date().toISOString();

  /**
   * Optional metadata to attach to the error, useful for internal logging or client debugging.
   */
  readonly meta?: Record<string, any>;

  /**
   * Constructs a new AppError instance.
   *
   * @param params.superCode - The broad category code for the error.
   * @param params.subCode - The specific subcode identifying the error case.
   * @param params.message - A human-readable description of the error.
   * @param params.meta - Optional additional metadata about the error.
   */
  constructor(params: {
    superCode: SuperErrorCodes;
    subCode: AllSubCodes;
    message: string;
    meta?: Record<string, any>;
  }) {

    super(params.message);
    this.name = this.constructor.name;
    this.superCode = params.superCode;
    this.subCode = params.subCode;
    this.meta = params.meta;

    if ("captureStackTrace" in Error) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns the complete error details including metadata and timestamp.
   * Useful for internal logging or detailed error diagnostics.
   */
  toJSON() : SerializedError {
    const formattedSubCode: ServiceSubCode = ErrorUtils.formatSubCode(CURRENT_SERVICE_PREFIX, Number(this.subCode));
    return {
      message: this.message,
      data:{
        super_code: this.superCode,
        sub_code: formattedSubCode,
        timestamp: this.timestamp,
        ...(this.meta && { meta: this.meta })
      }
    };
  }
}

/**
 * Represents validation-related application errors.
 */
export class ValidationFailed extends AppError {
  constructor(
    subCode: ValidationSubCodes,
    message?: string,
    meta?: Record<string, any>
  ) {
    const errorDef = validationErrors[subCode];

    const defaultMessage =
       errorDef?.description ?? "Validation failed";

    super({
      superCode: SuperErrorCodes.VALIDATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta
    });
  }
}

/**
 * Represents authentication-related application errors.
 */
export class AuthenticationFailed extends AppError {
  constructor(
    subCode: AuthenticationSubCodes,
    message?: string,
    meta?: Record<string, any>
  ) {
    const errorDef = authenticationErrors[subCode];

    const defaultMessage =
      errorDef?.description ??  "Authentication failed";

    super({
      superCode: SuperErrorCodes.AUTHENTICATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta,
    });
  }
}

/**
 * Represents authorization-related application errors.
 */
export class AuthorizationFailed extends AppError {
  constructor(
    subCode: AuthorizationSubCodes,
    message?: string,
    meta?: Record<string, any>
  ) {
    const errorDef = authorizationErrors[subCode];

    const defaultMessage =
      errorDef?.description ?? "Authorization failed";

    super({
      superCode: SuperErrorCodes.AUTHORIZATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta,
    });
  }
}

/**
 * Represents business-logic-related application errors.
 */
export class BusinessLogicFailed extends AppError {
  constructor(
    subCode: BusinessLogicSubCodes,
    message?: string,
    meta?: Record<string, any>
  ) {
    const errorDef = businessLogicErrors[subCode];

    const defaultMessage =
      errorDef?.description ?? "Business logic error";

    super({
      superCode: SuperErrorCodes.BUSINESS_LOGIC_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta,
    });
  }
}

/**
 * Represents errors from external services, APIs, or third-party clients.
 */
export class ExternalServiceFailed extends AppError {
  originalError?: Error;

  constructor(
    subCode: ExternalServiceSubCodes,
    message?: string,
    meta?: Record<string, any>,
    originalError?: unknown
  ) {
    const errorDef = externalServiceErrors[subCode];

    const defaultMessage =
      errorDef?.description ??
      "External service error";

    super({
      superCode: SuperErrorCodes.EXTERNAL_SERVICE_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta,
    });

    if (originalError instanceof Error) {
      this.originalError = originalError;
      this.stack = originalError.stack;
    }
  }

  toJSON(): SerializedError & { original_error?: string } {
    const base = super.toJSON();

    return {
      ...base,
      ...(this.originalError && {
        original_error: this.originalError.message,
      }),
    };
  }
}

/**
 * Represents system-level application errors.
 */
export class SystemLevelFailed extends AppError {
  constructor(
    subCode: SystemSubCodes,
    message?: string,
    meta?: Record<string, any>
  ) {
    const errorDef = systemErrors[subCode];

    const defaultMessage =
      errorDef?.description ?? "System error";

    super({
      superCode: SuperErrorCodes.SYSTEM_ERROR,
      subCode,
      message: message ?? defaultMessage,
      meta,
    });
  }
}
