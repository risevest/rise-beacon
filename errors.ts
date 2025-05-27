import {
  authenticationErrors,
  authorizationErrors,
  businessLogicErrors,
  ERROR_SYSTEM,
  externalServiceErrors,
  systemErrors,
  validationErrors
} from "./classification";
import {
  AuthErrorMetadata, AuthorizationErrorMetadata,
  BaseErrorMetadata,
  BusinessLogicMetadata,
  ERROR_CATEGORIES,
  ExternalServiceMetadata,
  LanguageCode,
  SerializedError,
  ValidationFailedMetadata
} from "./error.model";


/**
 * Base class for application errors.
 */
export class AppErrors extends Error {
  internal_status_code: keyof typeof ERROR_SYSTEM;
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
    internal_status_code: keyof typeof ERROR_SYSTEM,
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

    const template = description[language] || description.en || "Unknown error";
    const message = details ? formatLocalizedMessage(template, details) : template;

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

    //todo: update to extend the ErrorConstructor Type...
    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, this.constructor);
    // }

    if ("captureStackTrace" in Error) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
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
    };
  }

  /**
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
  }
}

/**
 * Represents validation-related application errors.
 */
export class ValidationFailed extends AppErrors {
  constructor(
    internal_status_code: keyof typeof validationErrors,
    details?: ValidationFailedMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = validationErrors[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }

    if (errorDef.category !== "validation") {
      throw new Error(`Internal status code ${internal_status_code} is not a validation error. Expected category: validation, got: ${errorDef.category}`);
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}

/**
 * Represents authentication-related application errors.
 */
export class AuthenticationFailed extends AppErrors {
  constructor(
    internal_status_code: keyof typeof authenticationErrors,
    details?: AuthErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = authenticationErrors[internal_status_code];
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
    internal_status_code: keyof typeof authorizationErrors,
    details?: AuthorizationErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = authorizationErrors[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "authorization") {
      throw new Error(
        `Internal status code ${internal_status_code} is not an authorization error. Expected category: authorization, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}

/**
 * Represents business-logic-related application errors.
 */
export class BusinessLogicFailed extends AppErrors {
  constructor(
    internal_status_code: keyof typeof businessLogicErrors,
    details?: BusinessLogicMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = businessLogicErrors[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "business_logic") {
      throw new Error(
        `Internal status code ${internal_status_code} is not a business logic error. Expected category: business_logic, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}

/**
 * Represents errors from external services or APIs.
 */
export class ExternalServiceFailed extends AppErrors {
  constructor(
    internal_status_code: keyof typeof externalServiceErrors,
    details?: ExternalServiceMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = externalServiceErrors[internal_status_code];
    if (!errorDef) {
      throw new Error(`Unknown internal status code: ${internal_status_code}`);
    }
    if (errorDef.category !== "external_service") {
      throw new Error(
        `Internal status code ${internal_status_code} is not an external service error. Expected category: external_service, got: ${errorDef.category}`
      );
    }

    super(internal_status_code, details, custom_message, language, service_name, request_id);
  }
}

/**
 * Represents system-level application errors.
 */
export class SystemLevelFailed extends AppErrors {
  constructor(
    internal_status_code: keyof typeof systemErrors,
    details?: BaseErrorMetadata,
    custom_message?: string,
    language: LanguageCode = "en",
    service_name?: string,
    request_id?: string
  ) {
    const errorDef = systemErrors[internal_status_code];
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

function formatLocalizedMessage(template: string, values: Record<string, any>): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return values[key] ?? `{{${key}}}`;
  });
}
