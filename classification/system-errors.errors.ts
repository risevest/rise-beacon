import { ErrorSystem } from "../error.model";
import { SystemErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const systemErrors: ErrorSystem ={

  // 6xxx - System Level Errors
  [SystemErrorCodes.INTERNAL_SERVER_ERROR]: {
    category: "system_level",
    description: {
      en: "Internal server error",
      fr: "Erreur interne du serveur",
      es: "Error interno del servidor"
    },
    severity: "critical",
    http_status_code: StatusCodes.INTERNAL_SERVER_ERROR
  },
  //will expand on this as it grows.
  [SystemErrorCodes.DATABASE_CONNECTION_FAILED]: {
    category: "system_level",
    description: {
      en: "Database connection failed",
      fr: "Échec de la connexion à la base de données",
      es: "Falló la conexión a la base de datos"
    },
    severity: "critical",
    http_status_code: StatusCodes.INTERNAL_SERVER_ERROR
  }
};
