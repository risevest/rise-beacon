import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { AuthenticationSubCodes } from "./error-codes";

export const authenticationErrors: ErrorSystem = {

  // 2xxx - Authentication Errors
  [AuthenticationSubCodes.BASE]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "Authentication failed"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.INVALID_CREDENTIALS]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "Invalid login credentials"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.TOKEN_EXPIRED]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "Token expired",
    },
    severity: "medium",
  },
  [AuthenticationSubCodes.TOKEN_INVALID]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "We could not verify your authentication",
    },
    severity: "high",
  },
  [AuthenticationSubCodes.NO_AUTH_HEADER]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "We could not authenticate your request"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.INVALID_AUTH_SCHEME]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "Authentication scheme is not supported"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.ACTION_MISMATCH]: {
    category: ERROR_CATEGORIES.authentication,
    description: {
      en: "The provided token is not valid for this action"
    },
    severity: "high",
  }
}
