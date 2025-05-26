import { ErrorSystem } from "../error.model";
import { BusinessLogicErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const businessLogicErrors: ErrorSystem = {
  // 4xxx - Business Logic Errors
  [BusinessLogicErrorCodes.BUSINESS_RULE_VIOLATION]: {
    category: "business_logic",
    description: {
      en: "Business rule violation",
      fr: "Violation de règle métier",
      es: "Violación de regla de negocio"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [BusinessLogicErrorCodes.RESOURCE_NOT_FOUND]: {
    category: "business_logic",
    description: {
      en: "{{resource_type}} with ID {{resource_id}} was not found.",
      fr: "{{resource_type}} avec l'ID {{resource_id}} est introuvable.",
      es: "{{resource_type}} con ID {{resource_id}} no fue encontrado."
    },
    severity: "medium",
    http_status_code: StatusCodes.NOT_FOUND
  },
  [BusinessLogicErrorCodes.RESOURCE_INACTIVE]: {
    category: "business_logic",
    description: {
      en: "Resource is inactive",
      fr: "Le compte est inactif",
      es: "La cuenta está inactiva"
    },
    severity: "medium",
    http_status_code: StatusCodes.FORBIDDEN
  }

};