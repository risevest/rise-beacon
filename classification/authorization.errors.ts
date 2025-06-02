import { AuthorizationSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { StatusCodes } from "http-status-codes";

export const authorizationErrors: ErrorSystem = {
  [AuthorizationSubCodes.ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access denied: You are not authorized to perform this action.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.RESOURCE_FORBIDDEN]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "You are not allowed to access this resource.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.INVALID_STATE]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "This action cannot be performed in the current state.",
    },
    severity: "medium",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.MISSING_PERMISSION]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Permission missing to perform the requested action.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.TENANT_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access to this tenant is denied.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.ORG_ACCESS_DENIED]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Access to this organization is denied.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationSubCodes.POLICY_VIOLATION]: {
    category: ERROR_CATEGORIES.authorization,
    description: {
      en: "Action violates an authorization policy.",
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  }
};
