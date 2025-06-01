import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { ValidationSubCodes } from "./error-codes";

export const validationErrors: ErrorSystem = {
  // 1xxx - Validation Errors
  [ValidationSubCodes.BASE]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Validation failed"
    },
    severity: "medium"
  },
  [ValidationSubCodes.INVALID_OTP]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Invalid or expired OTP"
    },
    severity: "medium"
  },
  [ValidationSubCodes.DUPLICATE_ENTRY]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Duplicate value found."
    },
    severity: "low"
  },
  [ValidationSubCodes.REQUIRED_FIELD_MISSING]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Required field missing"
    },
    severity: "medium"
  },
  [ValidationSubCodes.INVALID_FORMAT]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "Invalid format"
    },
    severity: "medium"
  },
  [ValidationSubCodes.UNPROCESSABLE_ENTITY]: {
    category: ERROR_CATEGORIES.validation,
    description: {
      en: "The some fields could not be processed due to a semantic validation error."
    },
    severity: "medium"
  }
};
