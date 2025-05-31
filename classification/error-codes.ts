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
  BASE = "00",

  /** The OTP provided is invalid */
  INVALID_OTP = "01",

  /** A resource with the same unique identifier already exists */
  DUPLICATE_ENTRY = "02",

  /** A required field is missing in the request payload */
  REQUIRED_FIELD_MISSING = "03",

  /** Input does not match the required format */
  INVALID_FORMAT = "04",

  /** The entity is semantically incorrect and cannot be processed */
  UNPROCESSABLE_ENTITY = "05"
}

/**
 * Subcodes for authentication errors.
 * Used with `super_code` 2000.
 */
export enum AuthenticationSubCodes {
  BASE = "00",

  /** Username or password is incorrect */
  INVALID_CREDENTIALS = "01",

  /** Token has expired and is no longer valid */
  TOKEN_EXPIRED = "02"
}

/**
 * Subcodes for authorization errors.
 * Used with `super_code` 3000.
 */
export enum AuthorizationSubCodes {
  ACCESS_DENIED = "00", //BASE

  /** Access to the requested resource is denied */
  RESOURCE_FORBIDDEN = "01",

  /** Operation is not allowed in the current state */
  INVALID_STATE = "02",

  /** Missing required permission for this action */
  MISSING_PERMISSION = "03",

  /** User is not allowed to access this tenant’s data */
  TENANT_ACCESS_DENIED = "04",

  /** User is not allowed to access this organization’s data */
  ORG_ACCESS_DENIED = "05",

  /** Policy restrictions have been violated */
  POLICY_VIOLATION = "06"
}

/**
 * Subcodes for business logic errors.
 * Used with `super_code` 4000.
 */
export enum BusinessLogicSubCodes {
  BASE = "00",

  /** The requested resource could not be found */
  RESOURCE_NOT_FOUND = "01",

  /** The resource is inactive and cannot be operated on */
  RESOURCE_INACTIVE = "02",

  /** A value does not match any valid enum entries */
  INVALID_ENUM_VALUE = "03"
}

/**
 * Subcodes for external service-related errors.
 * Used with `super_code` 5000.
 */
export enum ExternalServiceSubCodes {
  /** The downstream service is currently unavailable */
  SERVICE_UNAVAILABLE = "01",

  /** The request to the downstream service timed out */
  SERVICE_TIMEOUT = "02"
}

/**
 * Subcodes for internal system errors.
 * Used with `super_code` 6000.
 */
export enum SystemSubCodes {
  UNKNOWN_SYSTEM_ERROR = "00",

/** The system could not connect to the database */
  DATABASE_CONNECTION_FAILED = "01"
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
