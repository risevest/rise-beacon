import { ErrorSystem } from "../error.model";
import { AuthenticationErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";

export const authenticationErrors: ErrorSystem = {

  // 2xxx - Authentication Errors
  [AuthenticationErrorCodes.AUTHENTICATION_FAILED]: {
    category: "authentication",
    description: {
      en: "Authentication failed",
      fr: "L'authentification a échoué",
      es: "La autenticación falló"
    },
    severity: "high",
    http_status_code: StatusCodes.UNAUTHORIZED
  },
  [AuthenticationErrorCodes.INVALID_CREDENTIALS]: {
    category: "authentication",
    description: {
      en: "Invalid login credentials",
      fr: "Identifiants de connexion invalides",
      es: "Credenciales de inicio de sesión inválidas"
    },
    severity: "high",
    http_status_code: StatusCodes.UNAUTHORIZED
  },
  [AuthenticationErrorCodes.TOKEN_EXPIRED]: {
    category: "authentication",
    description: {
      en: "Token expired",
      fr: "Jeton expiré",
      es: "Token expirado"
    },
    severity: "medium",
    http_status_code: StatusCodes.UNAUTHORIZED
  },

}