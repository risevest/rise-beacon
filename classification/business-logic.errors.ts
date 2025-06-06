import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";

import { BusinessLogicSubCodes } from "./error-codes";

export const businessLogicErrors: ErrorSystem = {
  [BusinessLogicSubCodes.BASE]: {
    //BUSINESS_RULE_VIOLATION
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
  }
};
