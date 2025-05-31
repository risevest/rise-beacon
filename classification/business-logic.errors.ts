import { BusinessLogicSubCodes } from "./error-codes";
import { ErrorSystem } from "../error.model";

export const businessLogicErrors: ErrorSystem = {
  [BusinessLogicSubCodes.BASE]: { //BUSINESS_RULE_VIOLATION
    category: "business_logic",
    description: {
      en: "A business rule was violated."
    },
    severity: "medium"
  },

  [BusinessLogicSubCodes.RESOURCE_NOT_FOUND]: {
    category: "business_logic",
    description: {
      en: "The requested resource was not found."
    },
    severity: "medium"
  },

  [BusinessLogicSubCodes.RESOURCE_INACTIVE]: {
    category: "business_logic",
    description: {
      en: "The requested resource is inactive."
    },
    severity: "medium"
  },

  [BusinessLogicSubCodes.INVALID_ENUM_VALUE]: {
    category: "business_logic",
    description: {
      en: "An invalid value was provided for a required condition."
    },
    severity: "medium"
  }
};
