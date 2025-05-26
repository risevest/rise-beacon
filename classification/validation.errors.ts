import { ErrorSystem } from "../error.model";
import { ValidationErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";


export const validationErrors: ErrorSystem = {
  // 1xxx - Validation Errors
  [ValidationErrorCodes.VALIDATION_FAILED]: {
    category: "validation",
    description: {
      en: "Validation failed",
      fr: "La validation a échoué",
      es: "La validación falló"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationErrorCodes.INVALID_OTP]: {
    category: "validation",
    description: {
      en: "Invalid or expired OTP",
      fr: "OTP invalide ou expiré",
      es: "OTP inválido o expirado"
    },
    severity: "medium",
    http_status_code: StatusCodes.UNPROCESSABLE_ENTITY
  },
  [ValidationErrorCodes.DUPLICATE_ENTRY]: {
    category: "validation",
    description: {
      en: "Duplicate value found for {{conflicting_field}}: {{existing_value}}.",
      fr: "Valeur en double trouvée pour {{conflicting_field}} : {{existing_value}}.",
      es: "Valor duplicado encontrado para {{conflicting_field}}: {{existing_value}}."
    },
    severity: "low",
    http_status_code: StatusCodes.CONFLICT
  },
  [ValidationErrorCodes.REQUIRED_FIELD_MISSING]: {
    category: "validation",
    description: {
      en: "Required field missing",
      fr: "Champ obligatoire manquant",
      es: "Campo requerido faltante"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },
  [ValidationErrorCodes.INVALID_FORMAT]: {
    category: "validation",
    description: {
      en: "Invalid format",
      fr: "Format invalide",
      es: "Formato inválido"
    },
    severity: "medium",
    http_status_code: StatusCodes.BAD_REQUEST
  },

};