import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { ExternalServiceSubCodes } from "./error-codes";

export const externalServiceErrors: ErrorSystem = {
  [ExternalServiceSubCodes.SERVICE_UNAVAILABLE]: {
    category: ERROR_CATEGORIES.external_service,
    description: "An external service is currently unavailable."
  },

  [ExternalServiceSubCodes.SERVICE_TIMEOUT]: {
    category: ERROR_CATEGORIES.external_service,
    description: "The external service did not respond in time."
  },

  [ExternalServiceSubCodes.SERVICE_AUTH_FAILED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "Authentication failed with external service."
  },

  [ExternalServiceSubCodes.SERVICE_VERIFICATION_EXPIRED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "Verification token or process has expired or is no longer valid"
  },

  [ExternalServiceSubCodes.SERVICE_VALIDATION_ERROR]: {
    category: ERROR_CATEGORIES.external_service,
    description: "External service rejected request due to validation errors"
  },

  [ExternalServiceSubCodes.SERVICE_RESPONSE_INVALID]: {
    category: ERROR_CATEGORIES.external_service,
    description: "External service returned invalid response format"
  },

  [ExternalServiceSubCodes.SERVICE_DEGRADED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "External service is experiencing degraded performance"
  },

  [ExternalServiceSubCodes.SERVICE_QUOTA_EXCEEDED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "External service quota or rate limit exceeded"
  },

  [ExternalServiceSubCodes.SERVICE_NOT_FOUND]: {
    category: ERROR_CATEGORIES.external_service,
    description: "Requested resource not found in external service"
  },

  [ExternalServiceSubCodes.SERVICE_MISCONFIGURED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "External service configuration is invalid"
  },

  [ExternalServiceSubCodes.SERVICE_DUPLICATE_ENTRY]: {
    category: ERROR_CATEGORIES.external_service,
    description: "The external service rejected the request due to a duplicate record (e.g., existing customer or account)."
  },

  [ExternalServiceSubCodes.SERVICE_PROCESS_FAILED]: {
    category: ERROR_CATEGORIES.external_service,
    description: "The external service failed to process a valid request."
  },

  [ExternalServiceSubCodes.SERVICE_INSUFFICIENT_FUNDS]: {
    category: ERROR_CATEGORIES.external_service,
    description: "The operation failed due to insufficient funds or balance."
  },

  [ExternalServiceSubCodes.SERVICE_UNKNOWN_ERROR]: {
    category: ERROR_CATEGORIES.external_service,
    description: "Unknown external service error"
  }
};
