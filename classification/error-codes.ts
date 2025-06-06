/**
 * Top-level error categories used as `super_code` in error responses.
 * Each category corresponds to a broad domain of errors.
 *
 * @example
 * 1000 => Validation Errors
 * 2000 => Authentication Errors
 */
export enum SuperErrorCodes {
  /** Validation-related errors */
  VALIDATION_ERROR = 1000,

  /** Authentication failures (e.g., bad credentials, expired tokens) */
  AUTHENTICATION_ERROR = 2000,

  /** Authorization issues (e.g., missing permissions, access violations) */
  AUTHORIZATION_ERROR = 3000,

  /** Business rule violations or domain-specific logic errors */
  BUSINESS_LOGIC_ERROR = 4000,

  /** Failures from external services (e.g., timeouts, unavailability) */
  EXTERNAL_SERVICE_ERROR = 5000,

  /** Internal system errors (e.g., DB failure, server crash) */
  SYSTEM_ERROR = 6000
}

/**
 * Subcodes for validation errors.
 * These are used alongside `super_code` 1000 to identify specific validation issues.
 */
export enum ValidationSubCodes {
  BASE = 0,

  /** The OTP provided is invalid */
  INVALID_OTP = 1,

  /** A resource with the same unique identifier already exists */
  DUPLICATE_ENTRY = 2,

  /** A required field is missing in the request payload */
  REQUIRED_FIELD_MISSING = 3,

  /** Input does not match the required format */
  INVALID_FORMAT =  4,

  INVALID_INPUT = 5,

  /** The entity is semantically incorrect and cannot be processed */
  UNPROCESSABLE_ENTITY =  6,
}

/**
 * Subcodes for authentication errors.
 * Used with `super_code` 2000.
 */
export enum AuthenticationSubCodes {
  BASE = 0,

  /** Username or password is incorrect */
  INVALID_CREDENTIALS = 1,

  /** Token has expired and is no longer valid */
  TOKEN_EXPIRED = 2,

  /** Token is invalid or could not be verified */
  TOKEN_INVALID = 3,

  /** No Authorization header was provided in the request */
  NO_AUTH_HEADER = 4,

  /** The provided authentication scheme is not supported */
  INVALID_AUTH_SCHEME = 5,

  ACTION_MISMATCH = 6,
}

/**
 * Subcodes for authorization errors.
 * Used with `super_code` 3000.
 */
export enum AuthorizationSubCodes {
  ACCESS_DENIED = 0, //BASE

  /** Access to the requested resource is denied */
  RESOURCE_FORBIDDEN = 1,

  /** Operation is not allowed in the current state */
  INVALID_STATE = 2,

  /** Missing required permission for this action */
  MISSING_PERMISSION = 3,

  /** User is not allowed to access this tenant’s data */
  TENANT_ACCESS_DENIED = 4,

  /** User is not allowed to access this organization’s data */
  ORG_ACCESS_DENIED = 5,

  /** Policy restrictions have been violated */
  POLICY_VIOLATION = 6
}

/**
 * Subcodes for business logic errors.
 * Used with `super_code` 4000.
 */
export enum BusinessLogicSubCodes {
  BASE = 0,

  /** The requested resource could not be found */
  RESOURCE_NOT_FOUND = 1,

  /** The resource is inactive and cannot be operated on */
  RESOURCE_INACTIVE = 2,

  /** A value does not match any valid enum entries */
  INVALID_ENUM_VALUE = 3,

  /** The resource cannot be updated or acted upon due to its current state */
  RESOURCE_STATE_INVALID = 4,

  /** A domain/business rule was violated */
  RULE_VIOLATION = 5,

  /** A structural or contextual constraint was violated */
  CONSTRAINT_VIOLATION = 6,
}

/**
 * Subcodes for external service-related errors.
 * Used with `super_code` 5000.
 */
export enum ExternalServiceSubCodes {
  /** The downstream service is currently unavailable */
  SERVICE_UNAVAILABLE = 1,
  /** The request to the downstream service timed out */
  SERVICE_TIMEOUT = 2,
  /** Authentication failed when calling the external service */
  SERVICE_AUTH_FAILED = 3,
  /** The external service rejected the request format/data */
  SERVICE_VALIDATION_ERROR = 4,
  /** The external service returned an unexpected response format */
  SERVICE_RESPONSE_INVALID = 5,
  /** The external service is experiencing degraded performance */
  SERVICE_DEGRADED = 6,
  /** The external service quota/limits have been exceeded */
  SERVICE_QUOTA_EXCEEDED = 7,
  /** The requested resource was not found in the external service */
  SERVICE_NOT_FOUND = 8,
  /** The external service configuration is invalid */
  SERVICE_MISCONFIGURED = 9,
  /** Generic external service error that doesn't fit other categories */
  SERVICE_UNKNOWN_ERROR = 99
}

/**
 * Subcodes for internal system errors.
 * Used with `super_code` 6000.
 */
export enum SystemSubCodes {
  UNKNOWN_SYSTEM_ERROR = 0,

/** The system could not connect to the database */
  DATABASE_CONNECTION_FAILED = 1
}


/**
 * Grouped export of all subcodes by category.
 * Useful for dynamic resolution or mappings.
 */
export const ErrorSubCodes = {
  Validation: ValidationSubCodes,
  Authentication: AuthenticationSubCodes,
  Authorization: AuthorizationSubCodes,
  BusinessLogic: BusinessLogicSubCodes,
  ExternalService: ExternalServiceSubCodes,
  System: SystemSubCodes
};

export type AllSubCodes =
  | ValidationSubCodes
  | AuthenticationSubCodes
  | AuthorizationSubCodes
  | BusinessLogicSubCodes
  | ExternalServiceSubCodes
  | SystemSubCodes;
