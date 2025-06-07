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
  }
};
