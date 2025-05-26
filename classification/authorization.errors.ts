import { AuthorizationErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";
import { ErrorSystem } from "../error.model";

export const authorizationErrors: ErrorSystem = {
  // 3xxx - Authorization Errors
  [AuthorizationErrorCodes.ACCESS_DENIED]: {
    category: "authorization",
    description: {
      en: "Access denied - insufficient permissions",
      fr: "Accès refusé - permissions insuffisantes",
      es: "Acceso denegado - permisos insuficientes"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },
  [AuthorizationErrorCodes.RESOURCE_FORBIDDEN]: {
    category: "authorization",
    description: {
      en: "Resource forbidden",
      fr: "Ressource interdite",
      es: "Recurso prohibido"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },
  [AuthorizationErrorCodes.INVALID_STATE]: {
    category: "authorization",
    description: {
      en: "Operation not allowed in current state",
      fr: "Opération non autorisée dans l'état actuel",
      es: "Operación no permitida en el estado actual"
    },
    severity: "medium",
    http_status_code: StatusCodes.FORBIDDEN //CONFLICT
  },

}
