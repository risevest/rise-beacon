import { ErrorSystem } from "./error.model";

export const ERROR_SYSTEM: ErrorSystem = {
  // business-logic
  "4000": {
    category: "business-logic",
    description: {
      en: "External wallet not found."
    },
    severity: "medium"
  },

  "4001": {
    category: "business-logic",
    description: {
      en: "Account is inactive."
    },
    severity: "medium"
  },

  // validation errors...
  "1000": {
    category: "validation",
    description: {
      en: "Invalid request body"
    },
    severity: "medium"
  },

  "1001": {
    category: "validation",
    description: {
      en: "Your OTP has either expired or is invalid"
    },
    severity: "medium"
  },

  //authentication errors...
  "2000": {
    category: "authentication",
    description: {
      en: "We could not verify your authentication"
    },
    severity: "medium"
  },

  "2001": {
    category: "authentication",
    description: {
      en: "Invalid login credentials"
    },
    severity: "medium"
  },

  //authorization errors...
  "3000": {
    category: "authorization",
    description: {
      en: "You are not authorized to perform this action"
    },
    severity: "medium"
  },

  //external-service errors...
  "5000": {
    category: "external-service",
    description: {
      en: "External service is down"
    },
    severity: "high"
  },

  //system-level errors...
  "6000": {
    category: "system-level",
    description: {
      en: "We are having system level issues. Please bear with us."
    },
    severity: "critical"
  }
};
