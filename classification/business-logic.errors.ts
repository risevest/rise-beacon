import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { BusinessLogicSubCodes } from "./error-codes";

export const businessLogicErrors: ErrorSystem = {
  [BusinessLogicSubCodes.BASE]: {  //BUSINESS_RULE_VIOLATION
    category: ERROR_CATEGORIES.business_logic,
    description: "A business rule was violated."
  },

  [BusinessLogicSubCodes.RESOURCE_NOT_FOUND]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested resource was not found."
  },

  [BusinessLogicSubCodes.RESOURCE_INACTIVE]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested resource is inactive."
  },

  [BusinessLogicSubCodes.INVALID_ENUM_VALUE]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "An invalid value was provided for a required condition."
  },

  [BusinessLogicSubCodes.RESOURCE_STATE_INVALID]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The resource cannot be updated or acted upon due to its current state."
  },

  [BusinessLogicSubCodes.RULE_VIOLATION]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "A specific business rule was violated."
  },

  [BusinessLogicSubCodes.CONSTRAINT_VIOLATION]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "A domain constraint or structural limit was violated."
  },

  [BusinessLogicSubCodes.RESOURCE_NOT_SUPPORTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The resource is not supported in this context."
  },

  [BusinessLogicSubCodes.RATE_LIMIT_EXCEEDED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The client has exceeded allowed request rate limits."
  },

  [BusinessLogicSubCodes.INSUFFICIENT_FUNDS]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The user does not have sufficient balance to complete this action."
  },

  [BusinessLogicSubCodes.LIMIT_RESTRICTION]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "This action is restricted based on the user's tier, KYC level, or applicable limits."
  },

  [BusinessLogicSubCodes.FEATURE_NOT_IMPLEMENTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested feature is not implemented."
  },

  [BusinessLogicSubCodes.CURRENCY_NOT_SUPPORTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested currency is not supported."
  },

  [BusinessLogicSubCodes.LOCATION_NOT_SUPPORTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested location, region OR country is not supported."
  },

  [BusinessLogicSubCodes.PROVIDER_NOT_SUPPORTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested provider is not supported."
  },

  [BusinessLogicSubCodes.CATEGORY_NOT_SUPPORTED]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The requested category is not supported."
  },
  [BusinessLogicSubCodes.DUPLICATE_PROCESS]: {
    category: ERROR_CATEGORIES.business_logic,
    description: "The process was already completed or attempted more than once. The same process was triggered more than once simultaneously"
  },
};
