import { validationErrors } from "./validation.errors";
import { authenticationErrors } from "./authentication.errors";
import { businessLogicErrors } from "./business-logic.errors";
import { authorizationErrors } from "./authorization.errors";
import { externalServiceErrors } from "./external-service.errors";
import { systemErrors } from "./system-errors.errors";
import { ErrorSystem } from "../error.model";

export const ERROR_SYSTEM: ErrorSystem = {
  ...validationErrors,
  ...authenticationErrors,
  ...authorizationErrors,
  ...businessLogicErrors,
  ...externalServiceErrors,
  ...systemErrors
};