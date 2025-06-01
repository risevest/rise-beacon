import { AuthorizationSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";

export const authorizationErrors: ErrorSystem = {
  [AuthorizationSubCodes.ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access denied: You are not authorized to perform this action.",
    },
    severity: "high"
  },

  [AuthorizationSubCodes.RESOURCE_FORBIDDEN]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "You are not allowed to access this resource.",
    },
    severity: "high"
  },

  [AuthorizationSubCodes.INVALID_STATE]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "This action cannot be performed in the current state.",
    },
    severity: "medium"
  },

  [AuthorizationSubCodes.MISSING_PERMISSION]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Permission missing to perform the requested action.",
    },
    severity: "high"
  },

  [AuthorizationSubCodes.TENANT_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access to this tenant is denied.",
    },
    severity: "high"
  },

  [AuthorizationSubCodes.ORG_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access to this organization is denied.",
    },
    severity: "high"
  },

  [AuthorizationSubCodes.POLICY_VIOLATION]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Action violates an authorization policy.",
    },
    severity: "high"
  }
};
