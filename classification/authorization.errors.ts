import { AuthorizationSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";

export const authorizationErrors: ErrorSystem = {
  [AuthorizationSubCodes.ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: "Access denied: You are not authorized to perform this action."
  },

  [AuthorizationSubCodes.RESOURCE_FORBIDDEN]: {
    category: ERROR_CATEGORIES.authorization,
    description: "You are not allowed to access this resource."
  },

  [AuthorizationSubCodes.INVALID_STATE]: {
    category: ERROR_CATEGORIES.authorization,
    description: "This action cannot be performed in the current state."
  },

  [AuthorizationSubCodes.MISSING_PERMISSION]: {
    category: ERROR_CATEGORIES.authorization,
    description: "Permission missing to perform the requested action."
  },

  [AuthorizationSubCodes.TENANT_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: "Access to this tenant is denied."
  },

  [AuthorizationSubCodes.ORG_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description:  "Access to this organization is denied."
  },

  [AuthorizationSubCodes.POLICY_VIOLATION]: {
    category: ERROR_CATEGORIES.authorization,
    description: "Action violates an authorization policy."
  }
};
