<<<<<<< HEAD
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
  ValidationSubCodes
} from "./classification";
import { LanguageCode, MiniSerializedError, SerializedError } from "./error.model";
import { StatusCodes } from "http-status-codes";

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
   * HTTP status code that should be returned for this error.
   */
  readonly httpStatusCode: StatusCodes;

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
    httpStatusCode: StatusCodes;
    meta?: Record<string, any>;
  }) {

    super(params.message);
    this.name = this.constructor.name;
    this.superCode = params.superCode;
    this.subCode = params.subCode;
    this.meta = params.meta;
    this.httpStatusCode = params.httpStatusCode;
=======
import { ERROR_SYSTEM } from "./classification";
import {
  AuthErrorMetadata,
  BaseErrorMetadata,
  BusinessLogicMetadata,
  ERROR_CATEGORIES,
  ExternalServiceMetadata,
  LanguageCode, SerializedError,
  ValidationFailedMetadata
} from "./error.model";


/**
 * Base class for application errors.
 */
export class AppErrors extends Error {
  internal_status_code: string;
  category: string;
  severity: string;
  description: Record<string, any>;
  details?: Record<string, any>;
  http_status_code: number;
  name: string;
  timestamp: string;
  service_name?: string;
  request_id?: string;

  /**
   * Creates a new instance of AppErrors.
   *
   * @param internal_status_code - The internal error code used within the system.
   * @param details - Optional metadata or contextual details about the error.
   * @param custom_message - Optional custom error message in the specified language.
   * @param language - Language code for localization (default is 'en').
   * @param service_name - Optional name of the service that generated the error.
   * @param request_id - Optional unique identifier for tracing the request.
   */
  constructor(
    internal_status_code: string,
    details?: Record<string, any>,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];

    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }

    let description = { ...errorDef.description };

    if (custom_message) {
      description[language] = custom_message;
    }

    const message = description[language] || description.en || "Unknown error";

    super(message);

    this.name = this.constructor.name;
    this.internal_status_code = internal_status_code;
    this.category = errorDef.category;
    this.severity = errorDef.severity;
    this.description = description;
    this.details = details;
    this.http_status_code = errorDef.http_status_code;
    this.timestamp = new Date().toISOString();
    this.service_name = service_name;
    this.request_id = request_id;

    //todo: update to extend the ErrorConstructor Type
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor);
    // }
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))

    if ("captureStackTrace" in Error) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
<<<<<<< HEAD
   * Returns a minimal structure suitable for API responses.
   */
  toMinimalJSON() : MiniSerializedError {
    return {
      message: this.message,
      data:{
        super_code: this.superCode,
        sub_code: this.subCode,
      }
=======
   * Serializes the error instance to a structured JSON object.
   *
   * @returns A serialized version of the error.
   */
  toJSON(): SerializedError {
    return {
      internal_status_code: this.internal_status_code,
      category: this.category,
      description: this.description,
      severity: this.severity,
      http_status_code: this.http_status_code,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details }),
      ...(this.service_name && { service_name: this.service_name }),
      ...(this.request_id && { request_id: this.request_id })
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
    };
  }

  /**
<<<<<<< HEAD
   * Returns the complete error details including metadata and timestamp.
   * Useful for internal logging or detailed error diagnostics.
   */
  toJSON() : SerializedError {
    return {
      message: this.message,
      data:{
        super_code: this.superCode,
        sub_code: this.subCode,

        timestamp: this.timestamp,
        http_status_code: this.httpStatusCode,
        ...(this.meta && { meta: this.meta })
      }
    };
=======
   * Retrieves a localized error message based on the specified language.
   *
   * @param language - Language code (default is 'en').
   * @returns Localized error message.
   */
  getMessage(language: LanguageCode = "en"): string {
    return this.description[language] || this.description.en || this.message;
  }

  /**
   * Checks whether the error belongs to a specific category.
   *
   * @param category - The error category to check against.
   * @returns True if the error category matches; otherwise, false.
   */
  isCategory(category: keyof typeof ERROR_CATEGORIES): boolean {
    return this.category === category;
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
  }
}

/**
 * Represents validation-related application errors.
 */
<<<<<<< HEAD
export class ValidationFailed extends AppError {
  constructor(
    subCode: ValidationSubCodes,
    message?: string,
    meta?: Record<string, any>,
    language: LanguageCode = "en"
  ) {
    const errorDef = validationErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ?? errorDef?.description?.en ?? "Validation failed";

    super({
      superCode: SuperErrorCodes.VALIDATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
      meta
    });
=======
export class ValidationFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: ValidationFailedMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }

    if (errorDef.category !== "validation") {
      throw new Error(`Internal status code ${internal_status_code} is not a validation error. Expected category: validation, got: ${errorDef.category}`);
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
  }
}

/**
 * Represents authentication-related application errors.
 */
<<<<<<< HEAD
export class AuthenticationFailed extends AppError {
  constructor(
    subCode: AuthenticationSubCodes,
    message?: string,
    meta?: Record<string, any>,
    language: LanguageCode = "en"
  ) {
    const errorDef = authenticationErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ?? errorDef?.description?.en ??  "Authentication failed";

    super({
      superCode: SuperErrorCodes.AUTHENTICATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
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
    meta?: Record<string, any>,
    language: LanguageCode = "en"
  ) {
    const errorDef = authorizationErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ?? errorDef?.description?.en ?? "Authorization failed";

    super({
      superCode: SuperErrorCodes.AUTHORIZATION_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
      meta,
    });
=======
export class AuthenticationFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: AuthErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "authentication") {
      throw new Error(
        `Internal status code ${internal_status_code} is not an authentication error. Expected category: authentication, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}


/**
 * Represents authorization-related application errors.
 */
export class AuthorizationFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: BaseErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "authorization") {
      throw new Error(
        `Internal status code ${internal_status_code} is not an authorization error. Expected category: authorization, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
  }
}

/**
 * Represents business-logic-related application errors.
 */
<<<<<<< HEAD
export class BusinessLogicFailed extends AppError {
  constructor(
    subCode: BusinessLogicSubCodes,
    message?: string,
    meta?: Record<string, any>,
    language: LanguageCode = "en"
  ) {
    const errorDef = businessLogicErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ?? errorDef?.description?.en ?? "Business logic error";

    super({
      superCode: SuperErrorCodes.BUSINESS_LOGIC_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
      meta,
    });
=======
export class BusinessLogicFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: BusinessLogicMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "business_logic") {
      throw new Error(
        `Internal status code ${internal_status_code} is not a business logic error. Expected category: business_logic, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
  }
}

/**
<<<<<<< HEAD
 * Represents errors from external services, APIs, or third-party clients.
 */
export class ExternalServiceFailed extends AppError {
  originalError?: Error;

  constructor(
    subCode: ExternalServiceSubCodes,
    message?: string,
    meta?: Record<string, any>,
    language: LanguageCode = "en",
    originalError?: unknown
  ) {
    const errorDef = externalServiceErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ??
      errorDef?.description?.en ??
      "External service error";

    super({
      superCode: SuperErrorCodes.EXTERNAL_SERVICE_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
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
=======
 * Represents errors from external services or APIs.
 */
export class ExternalServiceFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: ExternalServiceMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "external_service") {
      throw new Error(
        `Internal status code ${internal_status_code} is not an external service error. Expected category: external_service, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
  }
}

/**
 * Represents system-level application errors.
 */
<<<<<<< HEAD
export class SystemLevelFailed extends AppError {
  constructor(
    subCode: SystemSubCodes,
    message?: string,
    meta?: Record<string, any>,
    language: LanguageCode = "en"
  ) {
    const errorDef = systemErrors[subCode];

    const defaultMessage =
      errorDef?.description?.[language] ?? errorDef?.description?.en ?? "System error";

    super({
      superCode: SuperErrorCodes.SYSTEM_ERROR,
      subCode,
      message: message ?? defaultMessage,
      httpStatusCode: errorDef.http_status_code,
      meta,
    });
  }
}
=======
export class SystemLevelFailed extends AppErrors {
  constructor(
    internal_status_code: string,
    details?: BaseErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "system_level") {
      throw new Error(
        `Internal status code ${internal_status_code} is not a system level error. Expected category: system_level, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}

/**
 * Alias for backward compatibility: NotFoundError mapped to BusinessLogicFailed.
 */
export const NotFoundError = BusinessLogicFailed;

/**
 * Alias for backward compatibility: DuplicateError mapped to ValidationFailed.
 */
export const DuplicateError = ValidationFailed;

/**
 * Represents a wrapper error that encapsulates a system-level failure,
 * optionally including an original error object for debugging purposes.
 */
export class WrapperError extends SystemLevelFailed {
  originalError?: Error;

  constructor(
    message: string,
    originalError?: Error,
    details?: Record<string, any>,
    service_name?: string,
    request_id?: string
  ) {
    super("6000", details, message, "en", service_name, request_id);

    if (originalError?.stack) {
      this.stack = originalError.stack;
    }

    if (originalError) {
      this.originalError = originalError;
    }
  }

  /**
   * Converts the error to a JSON-serializable object, including the original error message.
   */
  toJSON(): SerializedError & { original_error?: string } {
    const base = super.toJSON();
    return {
      ...base,
      ...(this.originalError && { original_error: this.originalError.message })
    };
  }
}

>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
