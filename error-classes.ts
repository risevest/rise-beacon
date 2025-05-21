import { ERROR_SYSTEM } from "./classification";
import { StatusCodes } from "http-status-codes";
import {
  BusinessLogicMetadata,
  DuplicateErrorMetadata,
  NotFoundMetadata,
  ValidationFailedMetadata
} from "./error.model";

// 1xxx – Validation Errors
const VALIDATION_ERRORS = {
  ValidationFailed: "1000",
  InvalidOrExpiredOTP: "1001",
  DuplicateError: "1002",
} as const;

// 2xxx – Authentication Errors
const AUTH_ERRORS = {
  InvalidLoginCredentials: "2001",
} as const;

// 3xxx – Authorization Errors
const AUTHORIZATION_ERRORS = {
  Unauthorized: "3000",
} as const;

// 4xxx – Business Logic Errors
const BUSINESS_LOGIC_ERRORS = {
  BusinessLogic: "4000",
  NotFound: "4001",
  AccountInactive: "4002",
} as const;

// 5xxx – External Service Errors
const EXTERNAL_SERVICE_ERRORS = {
  ExternalServiceError: "5000",
} as const;

// 6xxx – Internal Errors
const INTERNAL_ERRORS = {
  InternalServerError: "6000",
} as const;

export const ERROR_CODES = {
  ...VALIDATION_ERRORS,
  ...AUTH_ERRORS,
  ...AUTHORIZATION_ERRORS,
  ...BUSINESS_LOGIC_ERRORS,
  ...EXTERNAL_SERVICE_ERRORS,
  ...INTERNAL_ERRORS,
} as const;

export class AppErrors extends Error {
  error_code: string;
  category: string;
  severity: string;
  description: Record<string, any>;
  details?: Record<string, any>;
  http_status_code: number;
  name: string;

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

export class ValidationFailed extends AppErrors {
  constructor(custom_message: string, details: ValidationFailedMetadata, status_code: number = StatusCodes.BAD_REQUEST) {
    super(ERROR_CODES.ValidationFailed, status_code, custom_message, details);
  }
}

export class NotFound extends AppErrors {
  constructor(custom_message: string, details?: NotFoundMetadata, params?: Record<string, any>, status_code: number = StatusCodes.NOT_FOUND) {
    super(ERROR_CODES.NotFound, status_code, custom_message, details, params);
  }
}

export class DuplicateError extends AppErrors {
  constructor(custom_message: string, details: DuplicateErrorMetadata, params?: Record<string, any>, status_code: number = StatusCodes.BAD_REQUEST) {
    super(ERROR_CODES.DuplicateError, status_code, custom_message, details, params);
  }
}

export class UnsupportedError extends AppErrors {
  constructor(custom_message: string, details?: NotFoundMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.Unauthorized, StatusCodes.UNAUTHORIZED, custom_message, details, params);
  }
}

export class BusinessLogic extends AppErrors {
  constructor(custom_message: string, details?: BusinessLogicMetadata, params?: Record<string, any>) {
    super(ERROR_CODES.BusinessLogic, StatusCodes.BAD_REQUEST, custom_message, details, params);
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
