export type { ParsedBeaconError } from "./types";
export { parseBeaconError } from "./parse";
export { matchBeaconError } from "./match";
export type { BeaconErrorHandlers } from "./match";

// v2: registry-bound typed client (define the system once, share it with the server)
export { BeaconClientError, createBeaconClient, UNKNOWN } from "./rehydrate";
export type { BeaconClient, BeaconMatchHandlers, ParsedError } from "./rehydrate";
export { ErrorUtils } from "../error-utils";
export { defineErrorSystem, beaconDefaultCategories } from "../registry";
export type {
  BeaconSystem,
  ErrorSystemConfig,
  CategoryDefinition,
  SubCodeDefinition,
  ErrorKey,
  ErrorFactories,
  BeaconErrorFactory,
  ResolvedCode
} from "../registry";

// Enums and types re-exported for use in client-side code
export {
  SuperErrorCodes,
  ValidationSubCodes,
  AuthenticationSubCodes,
  AuthorizationSubCodes,
  BusinessLogicSubCodes,
  ExternalServiceSubCodes,
  SystemSubCodes,
  ErrorSubCodes
} from "../classification";

export type { AllSubCodes } from "../classification";

export { ERROR_CATEGORIES } from "../error.model";
export type { SerializedError, SerializedErrorData } from "../error.model";
