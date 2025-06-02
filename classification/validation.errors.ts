import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { ValidationSubCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const validationErrors: ErrorSystem = {
  // 1xxx - Validation Errors
  [ValidationSubCodes.BASE]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Validation failed"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationSubCodes.INVALID_OTP]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Invalid or expired OTP"
    },
    severity: "medium",
    http_status_code: StatusCodes.UNPROCESSABLE_ENTITY
  },
  [ValidationSubCodes.DUPLICATE_ENTRY]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Duplicate value found."
    },
    severity: "low",
    http_status_code: StatusCodes.CONFLICT
  },
  [ValidationSubCodes.REQUIRED_FIELD_MISSING]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Required field missing"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationSubCodes.INVALID_FORMAT]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Invalid format"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationSubCodes.INVALID_INPUT]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Invalid input"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationSubCodes.UNPROCESSABLE_ENTITY]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "The some fields could not be processed due to a semantic validation error."
    },
    severity: "medium",
    http_status_code: StatusCodes.UNPROCESSABLE_ENTITY
  }
};
