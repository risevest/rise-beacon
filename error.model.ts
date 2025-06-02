// error.model.ts
import { AllSubCodes, SuperErrorCodes } from "./classification";

export const languageCode = <const>["en", "fr", "es"];
export type LanguageCode = (typeof languageCode)[number];

export const severity = <const>["low", "medium", "high", "critical"];
export type Severity = (typeof severity)[number];

type ErrorTranslation = {
  [key in LanguageCode]?: string;
};

export interface ErrorDefinition {
  description: ErrorTranslation;
  severity: Severity;
  category: ERROR_CATEGORIES;
  super_code?: number;
  sub_code?: number;
  http_status_code: number;
}

export interface ErrorSystem {
  [key: string]: ErrorDefinition;
}

// Error categories for better organization
export enum ERROR_CATEGORIES {
  validation = 1,
  authentication = 2,
  authorization = 3,
  business_logic = 4,
  external_service = 5,
  system_level = 6
}

/**
 * Mini-serialized representation of an application error.
 */
export interface MiniSerializedError {
  super_code: SuperErrorCodes;
  sub_code: AllSubCodes;
  message: string;
}

/**
 * Mini-serialized representation of an application error.
 */
export interface SerializedError {
  super_code: SuperErrorCodes;
  sub_code: AllSubCodes;
  message: string;
  meta?: Record<string, any>;
  timestamp: string;
  http_status_code: number;
}

export interface ErrorConstructor {
  captureStackTrace?(targetObject: Object, constructorOpt?: Function): void;
}
