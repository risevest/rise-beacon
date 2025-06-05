import { ExternalServiceSubCodes } from "./error-codes";
import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { StatusCodes } from "http-status-codes";

export const externalServiceErrors: ErrorSystem = {
  [ExternalServiceSubCodes.SERVICE_UNAVAILABLE]: {
    category: ERROR_CATEGORIES.external_service,
    description: "An external service is currently unavailable."
  },

  [ExternalServiceSubCodes.SERVICE_TIMEOUT]: {
    category: ERROR_CATEGORIES.external_service,
    description: "The external service did not respond in time."
  }
};
