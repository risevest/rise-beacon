import { ErrorSystem } from "../error.model";
import { AuthenticationSubCodes } from "./error-codes";

export const authenticationErrors: ErrorSystem = {

  // 2xxx - Authentication Errors
  [AuthenticationSubCodes.BASE]: {
    category: "authentication",
    description: {
      en: "Authentication failed"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.INVALID_CREDENTIALS]: {
    category: "authentication",
    description: {
      en: "Invalid login credentials"
    },
    severity: "high",
  },
  [AuthenticationSubCodes.TOKEN_EXPIRED]: {
    category: "authentication",
    description: {
      en: "Token expired",
    },
    severity: "medium",
  },
}
