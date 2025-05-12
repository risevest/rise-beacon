import { AppErrors } from "@app/internal/errors";
import { StatusCodes } from "http-status-codes";

export const ERROR_CODES = {
  InvalidOrExpiredOTP: "1001",
  InvalidLoginCredentials: "2001",
  AccountInactive: "4001",
  ValidationFailed: "1000",
  Authenticate: "2000",
  NotFound: "4000",
  DuplicateError: "1002",
  InternalServerError: "6000",
  ExternalServiceError: "5000"
} as const;

export function createErrorClass(errorCodeKey: keyof typeof ERROR_CODES, httpStatusCode: number) {
  const errorCode = ERROR_CODES[errorCodeKey];

  return class extends AppErrors {
    constructor(customMessage?: string, details?: Record<string, any>, params?: Record<string, any>) {
      super(errorCode, httpStatusCode, customMessage, details, params);
    }
  };
}

export const InvalidLoginCredentials = createErrorClass("InvalidLoginCredentials", StatusCodes.UNAUTHORIZED);
export const AccountInactive = createErrorClass("AccountInactive", StatusCodes.UNAUTHORIZED);
export const InvalidOrExpiredOTP = createErrorClass("InvalidOrExpiredOTP", StatusCodes.UNPROCESSABLE_ENTITY);
export const Authenticate = createErrorClass("Authenticate", StatusCodes.UNAUTHORIZED);
export const NotFound = createErrorClass("NotFound", StatusCodes.NOT_FOUND);
export const DuplicateError = createErrorClass("DuplicateError", StatusCodes.BAD_REQUEST);
export const InternalServerError = createErrorClass("InternalServerError", StatusCodes.INTERNAL_SERVER_ERROR);
export const ExternalServiceError = createErrorClass("ExternalServiceError", StatusCodes.BAD_REQUEST);

export class ValidationFailed extends AppErrors {
  constructor(customMessage?: string, fields?: Record<string, string>) {
    super(ERROR_CODES.ValidationFailed, StatusCodes.BAD_REQUEST, customMessage, fields ? { fields } : undefined);
  }

  toJSON() {
    return {
      errorCode: this.errorCode,
      category: this.category,
      severity: this.severity,
      description: {
        en: this.message
      },
      ...(this.details && Object.keys(this.details).length > 0 ? { details: this.details } : {})
    };
  }
}
