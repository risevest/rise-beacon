const languageCode = <const>["en", "fr", "es"];
export type LanguageCode = (typeof languageCode)[number];

const services = <const>["rise-moneyio", "rise-plans", "rise-wallets"];
export type ServiceName = (typeof services)[number];

export const severity = <const>["low", "medium", "high", "critical"];
export type Severity = (typeof severity)[number];

type ErrorTranslation = {
  [key in LanguageCode]?: string;
};

export interface ErrorDefinition {
  class: string;
  description: ErrorTranslation;
  severity: Severity;
  service: ServiceName;
}

export interface ErrorSystem {
  [key: string]: ErrorDefinition;
}

// Service specific error code ranges
export const ERROR_RANGES = <const>{
  "rise-moneyio": { start: 1000, end: 1999 },
  "rise-plans": { start: 2000, end: 2999 },
  "rise-wallets": { start: 3000, end: 3999 }
};

// Error categories for better organization
export const ERROR_CATEGORIES = <const>{
  validation: "0",
  authentication: "1",
  authorization: "2",
  "business-logic": "3",
  "external-service": "4",
  database: "5",
  system: "6"
};
