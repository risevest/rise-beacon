import { ErrorSystem } from "../error.model";
import { ExternalServiceErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const externalServiceErrors: ErrorSystem = {
  // 5xxx - External Service Errors
  [ExternalServiceErrorCodes.SERVICE_UNAVAILABLE]: {
    category: "external_service",
    description: {
      en: "External service unavailable",
      fr: "Service externe indisponible",
      es: "Servicio externo no disponible"
    },
    severity: "high",
    http_status_code: StatusCodes.SERVICE_UNAVAILABLE
  },
  [ExternalServiceErrorCodes.SERVICE_TIMEOUT]: {
    category: "external_service",
    description: {
      en: "External service timeout",
      fr: "Délai d'attente du service externe",
      es: "Tiempo de espera del servicio externo"
    },
    severity: "high",
    http_status_code: StatusCodes.GATEWAY_TIMEOUT
  },
}
