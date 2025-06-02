import { BusinessLogicSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { StatusCodes } from "http-status-codes";

export const businessLogicErrors: ErrorSystem = {
  [BusinessLogicSubCodes.BASE]: { //BUSINESS_RULE_VIOLATION
    category: ERROR_CATEGORIES.business_logic,
    description: {
      en: "A business rule was violated."
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },

  [BusinessLogicSubCodes.RESOURCE_NOT_FOUND]: {
    category: ERROR_CATEGORIES.business_logic,
    description: {
      en: "The requested resource was not found."
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },

  [BusinessLogicSubCodes.RESOURCE_INACTIVE]: {
    category: ERROR_CATEGORIES.business_logic,
    description: {
      en: "The requested resource is inactive."
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },

  [BusinessLogicSubCodes.INVALID_ENUM_VALUE]: {
    category: ERROR_CATEGORIES.business_logic,
    description: {
      en: "An invalid value was provided for a required condition."
    },
    severity: "medium",
    http_status_code: StatusCodes.UNPROCESSABLE_ENTITY
  }
};
