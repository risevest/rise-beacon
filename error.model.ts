// error.model.ts
import { ServiceSubCode, SuperErrorCodes } from "./classification";

export interface ErrorDefinition {
  description: string;
  category: ERROR_CATEGORIES;
  super_code?: number;
  sub_code?: number;
}

export interface ErrorSystem {
  [key: string]: ErrorDefinition;
}

/**
 * Serialized representation of an application error.
 */
export interface SerializedError {
  message: string;
  data: SerializedErrorData;
}

export interface SerializedErrorData {
  super_code: SuperErrorCodes;
  sub_code: ServiceSubCode;
  meta?: Record<string, any>;
  timestamp?: string;
}

export interface ErrorConstructor {
  captureStackTrace?(targetObject: object, constructorOpt?: (...args: any[]) => any): void;
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
