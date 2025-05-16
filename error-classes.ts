import { ERROR_SYSTEM } from "./classification";
import { StatusCodes } from "http-status-codes";

export const ERROR_CODES = {
  InvalidOrExpiredOTP: "1001",
  InvalidLoginCredentials: "2001",
  AccountInactive: "4001",
  ValidationFailed: "1000",
  Unauthorized: "2000",
  NotFound: "4000",
  DuplicateError: "1002",
  ExternalServiceError: "5000",
  InternalServerError: "6000",
  BusinessLogic: "4000"
} as const;

export class AppErrors extends Error {
  error_code: string;
  category: string;
  severity: string;
  description: Record<string, any>;
  details?: Record<string, any>;
  http_status_code: number;

  constructor(
    error_code: string,
    http_status_code: number,
    custom_message?: string,
    details?: Record<string, any>,
    params?: Record<string, any>
  ) {
    const error = ERROR_SYSTEM[error_code] || {
      category: "unknown",
      description: { en: "Unknown error" },
      severity: "high"
    };

    let description = { ...error.description };

    if (custom_message) {
      description.en = custom_message;
    } else {
      Object.keys(description).forEach(lang => {
        description[lang] = description[lang];
      });
    }

    super(description.en);

    this.name = this.constructor.name;
    this.error_code = error_code;
    this.category = error.category;
    this.severity = error.severity;
    this.description = description;
    this.details = details;
    this.http_status_code = http_status_code;
  }

  toJSON() {
    const json: any = {
      error_code: this.error_code,
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

export function createErrorClass(error_codeKey: keyof typeof ERROR_CODES, http_status_code: number) {
  const error_code = ERROR_CODES[error_codeKey];

  return class extends AppErrors {
    constructor(custom_message?: string, details?: Record<string, any>, params?: Record<string, any>) {
      super(error_code, http_status_code, custom_message, details, params);
    }
  };
}

export const InvalidLoginCredentials = createErrorClass("InvalidLoginCredentials", StatusCodes.UNAUTHORIZED);
export const AccountInactive = createErrorClass("AccountInactive", StatusCodes.UNAUTHORIZED);
export const InvalidOrExpiredOTP = createErrorClass("InvalidOrExpiredOTP", StatusCodes.UNPROCESSABLE_ENTITY);
export const Unauthorized = createErrorClass("Unauthorized", StatusCodes.UNAUTHORIZED);
export const InternalServerError = createErrorClass("InternalServerError", StatusCodes.INTERNAL_SERVER_ERROR);
export const ExternalServiceError = createErrorClass("ExternalServiceError", StatusCodes.BAD_REQUEST);

type RequestDataSource = "params" | "query" | "body" | "header";

export interface ValidationFailedMetadata {
  fields: Record<string, string>;
  where: RequestDataSource;
}
export class ValidationFailed extends AppErrors {
  constructor(custom_message: string, details: ValidationFailedMetadata) {
    super(ERROR_CODES.ValidationFailed, StatusCodes.BAD_REQUEST, custom_message, details);
  }
}

export interface NotFoundMetadata {
  field: string;
  where: RequestDataSource;
}

export class NotFound extends AppErrors {
  constructor(custom_message: string, details?: NotFoundMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.NotFound, StatusCodes.NOT_FOUND, custom_message, details, params);
  }
}

export interface DuplicateErrorMetadata extends NotFoundMetadata {}

export class DuplicateError extends AppErrors {
  constructor(custom_message: string, details: DuplicateErrorMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.DuplicateError, StatusCodes.BAD_REQUEST, custom_message, details, params);
  }
}

export class WrapperError extends AppErrors {
  constructor(message: string, err?: Error, details?: Record<string, any>) {
    super(ERROR_CODES.InternalServerError, StatusCodes.UNAUTHORIZED, message, details);

    if (err?.stack) {
      this.stack = err.stack;
    }

    if (err) {
      (this as any).originalError = err;
    }
  }
}

export class UnsupportedError extends AppErrors {
  constructor(customMessage: string, details?: NotFoundMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.Unauthorized, StatusCodes.UNAUTHORIZED, customMessage, details, params);
  }
}

export class IOMethodError extends AppErrors {
  constructor(customMessage: string, details?: NotFoundMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.BusinessLogic, StatusCodes.BAD_REQUEST, customMessage, details, params);
  }
}

export interface BusinessLogicMetadata {
  field?: string;
  where?: RequestDataSource;
  context?: any;
}

export class BusinessLogic extends AppErrors {
  constructor(customMessage: string, details?: BusinessLogicMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.BusinessLogic, StatusCodes.BAD_REQUEST, customMessage, details, params);
  }
}

export class MethodNotImplemented extends AppErrors {
  constructor(paymentType: string = "Mobile money", details?: BusinessLogicMetadata, params?: Record<string, any>) {
    const message = `${paymentType} payment method not implemented`;
    super(ERROR_CODES.BusinessLogic, StatusCodes.BAD_REQUEST, message, details, params);
  }
}
