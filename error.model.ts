const languageCode = <const>["en", "fr", "es"];
export type LanguageCode = (typeof languageCode)[number];

export const severity = <const>["low", "medium", "high", "critical"];
export type Severity = (typeof severity)[number];

type ErrorTranslation = {
  [key in LanguageCode]?: string;
};

export interface ErrorDefinition {
  description: ErrorTranslation;
  severity: Severity;
  category: keyof typeof ERROR_CATEGORIES;
}

export interface ErrorSystem {
  [key: string]: ErrorDefinition;
}

// Error categories for better organization
export enum ERROR_CATEGORIES {
  validation = "1",
  authentication = "2",
  authorization = "3",
  "business-logic" = "4",
  "external-service" = "5",
  "system-level" = "6"
}
