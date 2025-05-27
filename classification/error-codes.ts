// error-codes.ts
export enum ValidationErrorCodes {
  VALIDATION_FAILED = 1000,
  INVALID_OTP = 1001,
  DUPLICATE_ENTRY = 1002,
  REQUIRED_FIELD_MISSING = 1003,
  INVALID_FORMAT = 1004,
  UNPROCESSABLE_ENTITY = 1005,
}

export enum AuthenticationErrorCodes {
  AUTHENTICATION_FAILED = 2000,
  INVALID_CREDENTIALS = 2001,
  TOKEN_EXPIRED = 2002
}

export enum AuthorizationErrorCodes {
  ACCESS_DENIED = 3000,
  RESOURCE_FORBIDDEN = 3001,
  INVALID_STATE = 3002

}

export enum BusinessLogicErrorCodes {
  BUSINESS_RULE_VIOLATION = 4000,
  RESOURCE_NOT_FOUND = 4001,
  RESOURCE_INACTIVE = 4002,
  INVALID_ENUM_VALUE = 4003
}

export enum ExternalServiceErrorCodes {
  SERVICE_UNAVAILABLE = 5000,
  SERVICE_TIMEOUT = 5001
}

export enum SystemErrorCodes {
  INTERNAL_SERVER_ERROR = 6000,
  DATABASE_CONNECTION_FAILED = 6001
}

export const ErrorCodes = {
  Validation: ValidationErrorCodes,
  Authentication: AuthenticationErrorCodes,
  Authorization: AuthorizationErrorCodes,
  BusinessLogic: BusinessLogicErrorCodes,
  ExternalService: ExternalServiceErrorCodes,
  System: SystemErrorCodes
};
