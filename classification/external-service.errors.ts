import { ExternalServiceSubCodes } from "./error-codes";
import { ErrorSystem } from "../error.model";

export const externalServiceErrors: ErrorSystem = {
  [ExternalServiceSubCodes.SERVICE_UNAVAILABLE]: {
    category: "external_service",
    description: {
      en: "An external service is currently unavailable."
    },
    severity: "high"
  },

  [ExternalServiceSubCodes.SERVICE_TIMEOUT]: {
    category: "external_service",
    description: {
      en: "The external service did not respond in time."
    },
    severity: "high",
  }
};
