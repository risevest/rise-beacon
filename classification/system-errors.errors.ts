import { ERROR_CATEGORIES, ErrorSystem } from "../error.model";
import { SystemSubCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const systemErrors: ErrorSystem = {
  [SystemSubCodes.UNKNOWN_SYSTEM_ERROR]: {
    category: ERROR_CATEGORIES.system_level,
    description: "A system error occurred. Please try again later."
  },
  [SystemSubCodes.DATABASE_CONNECTION_FAILED]: {
    category: ERROR_CATEGORIES.system_level,

    description: "Unable to connect to the database. Please try again later."
  }
};
