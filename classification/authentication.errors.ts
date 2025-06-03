import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { AuthenticationSubCodes } from "./error-codes";

export const authenticationErrors: ErrorSystem = {

  // 2xxx - Authentication Errors
  [AuthenticationSubCodes.BASE]: {
    category: ERROR_CATEGORIES.authentication,
    description: "Authentication failed"
  },
  [AuthenticationSubCodes.INVALID_CREDENTIALS]: {
    category: ERROR_CATEGORIES.authentication,
    description:  "Invalid login credentials"
  },
  [AuthenticationSubCodes.TOKEN_EXPIRED]: {
    category: ERROR_CATEGORIES.authentication,
    description: "Token expired"
  },
  [AuthenticationSubCodes.TOKEN_INVALID]: {
    category: ERROR_CATEGORIES.authentication,
    description: "We could not verify your authentication"
  },
  [AuthenticationSubCodes.NO_AUTH_HEADER]: {
    category: ERROR_CATEGORIES.authentication,
    description: "We could not authenticate your request"
  },
  [AuthenticationSubCodes.INVALID_AUTH_SCHEME]: {
    category: ERROR_CATEGORIES.authentication,
    description: "Authentication scheme is not supported"
  },
  [AuthenticationSubCodes.ACTION_MISMATCH]: {
    category: ERROR_CATEGORIES.authentication,
    description: "The provided token is not valid for this action"
  }
}
