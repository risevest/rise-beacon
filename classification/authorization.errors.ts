import { AuthorizationErrorCodes } from "./error-codes";
import { StatusCodes } from "http-status-codes";
import { ErrorSystem } from "../error.model";

export const authorizationErrors: ErrorSystem = {
  [AuthorizationErrorCodes.ACCESS_DENIED]: {
    category: "authorization",
    description: {
      en: "Access denied: You are not permitted to perform '{{attempted_action}}' on '{{resource_type}}' {{resource_id}}. Required role(s): {{required_roles}}. You have: {{actual_roles}}.",
      fr: "Accès refusé : Vous n'êtes pas autorisé à effectuer '{{attempted_action}}' sur '{{resource_type}}' {{resource_id}}. Rôle(s) requis : {{required_roles}}. Vous avez : {{actual_roles}}.",
      es: "Acceso denegado: No tiene permiso para realizar '{{attempted_action}}' en '{{resource_type}}' {{resource_id}}. Rol(es) requerido(s): {{required_roles}}. Usted tiene: {{actual_roles}}."
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.RESOURCE_FORBIDDEN]: {
    category: "authorization",
    description: {
      en: "Access to '{{resource_type}}' {{resource_id}} is forbidden. {{reason}}",
      fr: "L'accès à '{{resource_type}}' {{resource_id}} est interdit. {{reason}}",
      es: "El acceso a '{{resource_type}}' {{resource_id}} está prohibido. {{reason}}"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.INVALID_STATE]: {
    category: "authorization",
    description: {
      en: "Operation '{{attempted_action}}' is not allowed in the current state. {{reason}}",
      fr: "L'opération '{{attempted_action}}' n'est pas autorisée dans l'état actuel. {{reason}}",
      es: "La operación '{{attempted_action}}' no está permitida en el estado actual. {{reason}}"
    },
    severity: "medium",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.MISSING_PERMISSION]: {
    category: "authorization",
    description: {
      en: "Missing required permission '{{permission_required}}' for action '{{attempted_action}}'.",
      fr: "Permission requise '{{permission_required}}' manquante pour l'action '{{attempted_action}}'.",
      es: "Falta el permiso requerido '{{permission_required}}' para la acción '{{attempted_action}}'."
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.TENANT_ACCESS_DENIED]: {
    category: "authorization",
    description: {
      en: "Access denied to tenant '{{tenant_id}}'. {{reason}}",
      fr: "Accès refusé au tenant '{{tenant_id}}'. {{reason}}",
      es: "Acceso denegado al tenant '{{tenant_id}}'. {{reason}}"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.ORG_ACCESS_DENIED]: {
    category: "authorization",
    description: {
      en: "Access denied to organization '{{org_id}}' within tenant '{{tenant_id}}'. {{reason}}",
      fr: "Accès refusé à l'organisation '{{org_id}}' du tenant '{{tenant_id}}'. {{reason}}",
      es: "Acceso denegado a la organización '{{org_id}}' del tenant '{{tenant_id}}'. {{reason}}"
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  },

  [AuthorizationErrorCodes.POLICY_VIOLATION]: {
    category: "authorization",
    description: {
      en: "Access denied due to violation of authorization policy '{{auth_policy}}'.",
      fr: "Accès refusé en raison de la violation de la politique d'autorisation '{{auth_policy}}'.",
      es: "Acceso denegado debido a la violación de la política de autorización '{{auth_policy}}'."
    },
    severity: "high",
    http_status_code: StatusCodes.FORBIDDEN
  }
};