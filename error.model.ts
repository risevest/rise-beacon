// error.model.ts
<<<<<<< HEAD
import { AllSubCodes, SuperErrorCodes } from "./classification";

=======
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
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
<<<<<<< HEAD
  category: ERROR_CATEGORIES;
  super_code?: number;
  sub_code?: number;
  http_status_code: number;
=======
  category: keyof typeof ERROR_CATEGORIES;
  internal_status_code?: number; // for subcategorization within error groups
  http_status_code: number;

>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
}

export interface ErrorSystem {
  [key: string]: ErrorDefinition;
}

// Error categories for better organization
export enum ERROR_CATEGORIES {
<<<<<<< HEAD
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
  message: string;
  data: SerializedErrorData;
}

/**
 * Mini-serialized representation of an application error.
 */
export interface SerializedError {
  message: string;
  data: SerializedErrorData;
}

export interface SerializedErrorData{
  super_code: SuperErrorCodes;
  sub_code: AllSubCodes;
  meta?: Record<string, any>;
  timestamp?: string;
  http_status_code?: number;
=======
  validation = "1",
  authentication = "2",
  authorization = "3",
  business_logic = "4",
  external_service = "5",
  system_level = "6"
}

type RequestDataSource = "params" | "query" | "body" | "header" | "context";

export interface BaseErrorMetadata {
  where?: RequestDataSource;
  field?: string;
  fields?: Record<string, string>;
  context?: any;
  service_name?: string;
  request_id?: string;
}

export interface NotFoundMetadata extends BaseErrorMetadata {
  resource_type?: string;
  resource_id?: string;
}

export interface DuplicateErrorMetadata extends BaseErrorMetadata {
  conflicting_field?: string;
  existing_value?: any;
}

export interface ValidationFailedMetadata extends BaseErrorMetadata {
  validation_rules?: string[];
  invalid_value?: any;
}

export interface BusinessLogicMetadata extends BaseErrorMetadata {
  business_rule?: string;
  required_conditions?: string[];
}

export interface AuthErrorMetadata extends BaseErrorMetadata {
  auth_method?: string;
  token_type?: string;
}

export interface ExternalServiceMetadata extends BaseErrorMetadata {
  service_name?: string;
  endpoint?: string;
  response_code?: number;
}

/**
 * Serialized representation of an application error.
 */
export interface SerializedError {
  internal_status_code: string;
  category: string;
  description: Record<string, string>;
  severity: string;
  http_status_code: number;
  details?: Record<string, any>;
  timestamp: string;
  service_name?: string;
  request_id?: string;
>>>>>>> 7544480 (refactor: Change System Design Impl of error sys feat (#2))
}

export interface ErrorConstructor {
  captureStackTrace?(targetObject: Object, constructorOpt?: Function): void;
}
