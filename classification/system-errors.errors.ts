import { ErrorSystem } from "../error.model";
import { SystemSubCodes } from "./error-codes";

export const systemErrors: ErrorSystem = {
  [SystemSubCodes.UNKNOWN_SYSTEM_ERROR]: {
    description: {
      en: "A system error occurred. Please try again later."
    },
    category: "system_level",
    severity: "critical"
  },

  [SystemSubCodes.DATABASE_CONNECTION_FAILED]: {
    description: {
      en: "Unable to connect to the database. Please try again later."
    },
    category: "system_level",
    severity: "critical"
  }
};
