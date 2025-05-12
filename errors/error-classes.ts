import { StatusCodes } from "http-status-codes";
import { ERROR_SYSTEM } from "./classification";

export const ERROR_CODES = {
  InvalidOrExpiredOTP: "1001",
  InvalidLoginCredentials: "2001",
  AccountInactive: "4001",
  ValidationFailed: "1000",
  Authenticate: "2000",
  NotFound: "4000",
  DuplicateError: "1002",
  ExternalServiceError: "5000",
  InternalServerError: "6000"
} as const;

export class AppErrors extends Error {
  errorCode: string;
  category: string;
  severity: string;
  description: Record<string, any>;
  details?: Record<string, any>;
  httpStatusCode: number;

  constructor(
    errorCode: string,
    httpStatusCode: number,
    customMessage?: string,
    details?: Record<string, any>,
    params?: Record<string, any>
  ) {
    const error = ERROR_SYSTEM[errorCode] || {
      category: "unknown",
      description: { en: "Unknown error" },
      severity: "high"
    };

    let description = { ...error.description };

    if (customMessage) {
      description.en = customMessage;
    } else {
      Object.keys(description).forEach(lang => {
        description[lang] = description[lang];
      });
    }

    super(description.en);

    this.name = this.constructor.name;
    this.errorCode = errorCode;
    this.category = error.category;
    this.severity = error.severity;
    this.description = description;
    this.details = details;
    this.httpStatusCode = httpStatusCode;
  }

  toJSON() {
    const json: any = {
      errorCode: this.errorCode,
      category: this.category,
      description: this.description,
      severity: this.severity
    };

    if (this.details && Object.keys(this.details).length > 0) {
      json.details = this.details;
    }

    return json;
  }
}

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

export interface NotFoundMetadata {
  field: string;
  where: "path" | "query" | "body" | "header";
}

export class NotFound extends AppErrors {
  details?: NotFoundMetadata

  constructor(customMessage:string, details?: NotFoundMetadata) {
    super(ERROR_CODES.NotFound, StatusCodes.NOT_FOUND, customMessage);
  }

  toJSON(){
    errorCode: this.errorCode,
    category: this.category,
    severity: this.severity,
    description: {
      en: this.message
    },
    details: this.details
  }
}
