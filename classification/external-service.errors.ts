import { ExternalServiceSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { StatusCodes } from "http-status-codes";

export const externalServiceErrors: ErrorSystem = {
  [ExternalServiceSubCodes.SERVICE_UNAVAILABLE]: {
    category: ERROR_CATEGORIES.external_service,
    description: {
      en: "An external service is currently unavailable."
    },
    severity: "high",
    http_status_code: StatusCodes.SERVICE_UNAVAILABLE
  },

  [ExternalServiceSubCodes.SERVICE_TIMEOUT]: {
    category: ERROR_CATEGORIES.external_service,
    description: {
      en: "The external service did not respond in time."
    },
    severity: "high",
    http_status_code: StatusCodes.SERVICE_UNAVAILABLE
  }
};
