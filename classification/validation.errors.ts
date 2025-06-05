import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { ValidationSubCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const validationErrors: ErrorSystem = {
  // 1xxx - Validation Errors
  [ValidationSubCodes.BASE]: {
    category: ERROR_CATEGORIES.validation,
    description: "Validation failed"
  },
  [ValidationSubCodes.INVALID_OTP]: {
    category: ERROR_CATEGORIES.validation,
    description: "Invalid or expired OTP"
  },
  [ValidationSubCodes.DUPLICATE_ENTRY]: {
    category: ERROR_CATEGORIES.validation,
    description: "Duplicate value found."
  },
  [ValidationSubCodes.REQUIRED_FIELD_MISSING]: {
    category: ERROR_CATEGORIES.validation,
    description: "Required field missing"
  },
  [ValidationSubCodes.INVALID_FORMAT]: {
    category: ERROR_CATEGORIES.validation,
    description: "Invalid format"
  },
  [ValidationSubCodes.INVALID_INPUT]: {
    category: ERROR_CATEGORIES.validation,
    description:  "Invalid input"
  },
  [ValidationSubCodes.UNPROCESSABLE_ENTITY]: {
    category: ERROR_CATEGORIES.validation,
    description: "The some fields could not be processed due to a semantic validation error."
  }
};
