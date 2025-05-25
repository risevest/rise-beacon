// classification.ts
import { ErrorSystem } from "./error.model";
import { StatusCodes } from "http-status-codes";

export const ERROR_SYSTEM: ErrorSystem = {
  // 1xxx - Validation Errors
  "1000": {
    category: "validation",
    description: {
      en: "Validation failed",
      fr: "La validation a échoué",
      es: "La validación falló"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  "1001": {
    category: "validation",
    description: {
      en: "Invalid or expired OTP",
      fr: "OTP invalide ou expiré",
      es: "OTP inválido o expirado"
    },
    severity: "medium",
    http_status_code: StatusCodes.UNPROCESSABLE_ENTITY
  },
  "1002": {
    category: "validation",
    description: {
      en: "Duplicate entry detected",
      fr: "Entrée en double détectée",
      es: "Entrada duplicada detectada"
    },
    severity: "medium",
    http_status_code: StatusCodes.CONFLICT
  },
  "1003": {
    category: "validation",
    description: {
      en: "Required field missing",
      fr: "Champ obligatoire manquant",
      es: "Campo requerido faltante"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  "1004": {
    category: "validation",
    description: {
      en: "Invalid format",
      fr: "Format invalide",
      es: "Formato inválido"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },

  // 2xxx - Authentication Errors
  "2000": {
    category: "authentication",
    description: {
      en: "Authentication failed",
      fr: "L'authentification a échoué",
      es: "La autenticación falló"
    },
    severity: "high",
    http_status_code: StatusCodes.UNAUTHORIZED
  },
  "2001": {
    category: "authentication",
    description: {
      en: "Invalid login credentials",
      fr: "Identifiants de connexion invalides",
      es: "Credenciales de inicio de sesión inválidas"
    },
    severity: "high",
    http_status_code: StatusCodes.UNAUTHORIZED
  },
  "2002": {
    category: "authentication",
    description: {
      en: "Token expired",
      fr: "Jeton expiré",
      es: "Token expirado"
    },
    severity: "medium",
    http_status_code: StatusCodes.UNAUTHORIZED
  },

  // 3xxx - Authorization Errors
  "3000": {
    category: "authorization",
    description: {
      en: "Access denied - insufficient permissions",
      fr: "Accès refusé - permissions insuffisantes",
      es: "Acceso denegado - permisos insuficientes"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },
  "3001": {
    category: "authorization",
    description: {
      en: "Resource forbidden",
      fr: "Ressource interdite",
      es: "Recurso prohibido"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  // 4xxx - Business Logic Errors
  "4000": {
    category: "business_logic",
    description: {
      en: "Business rule violation",
      fr: "Violation de règle métier",
      es: "Violación de regla de negocio"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  "4001": {
    category: "business_logic",
    description: {
      en: "Resource not found",
      fr: "Ressource non trouvée",
      es: "Recurso no encontrado"
    },
    severity: "medium",
    http_status_code: StatusCodes.NOT_FOUND
  },
  "4002": {
    category: "business_logic",
    description: {
      en: "Account is inactive",
      fr: "Le compte est inactif",
      es: "La cuenta está inactiva"
    },
    severity: "medium",
    http_status_code: StatusCodes.FORBIDDEN
  },
  "4003": {
    category: "business_logic",
    description: {
      en: "Operation not allowed in current state",
      fr: "Opération non autorisée dans l'état actuel",
      es: "Operación no permitida en el estado actual"
    },
    severity: "medium",
    // internal_status_code: "INVALID_STATE"
    http_status_code: StatusCodes.FORBIDDEN //CONFLICT
  },

  // 5xxx - External Service Errors
  "5000": {
    category: "external_service",
    description: {
      en: "External service unavailable",
      fr: "Service externe indisponible",
      es: "Servicio externo no disponible"
    },
    severity: "high",
    http_status_code: StatusCodes.SERVICE_UNAVAILABLE
  },
  "5001": {
    category: "external_service",
    description: {
      en: "External service timeout",
      fr: "Délai d'attente du service externe",
      es: "Tiempo de espera del servicio externo"
    },
    severity: "high",
    http_status_code: StatusCodes.GATEWAY_TIMEOUT
  },

  // 6xxx - System Level Errors
  "6000": {
    category: "system_level",
    description: {
      en: "Internal server error",
      fr: "Erreur interne du serveur",
      es: "Error interno del servidor"
    },
    severity: "critical",
    http_status_code: StatusCodes.INTERNAL_SERVER_ERROR
  },
  "6001": {
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
