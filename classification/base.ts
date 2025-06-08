import { ErrorSystem } from '../error.model';
import { authenticationErrors } from './authentication.errors';
import { authorizationErrors } from './authorization.errors';
import { businessLogicErrors } from './business-logic.errors';
import { externalServiceErrors } from './external-service.errors';
import { systemErrors } from './system-errors.errors';
import { validationErrors } from './validation.errors';

export const ERROR_SYSTEM: ErrorSystem = {
  ...validationErrors,
  ...authenticationErrors,
  ...authorizationErrors,
  ...businessLogicErrors,
  ...externalServiceErrors,
  ...systemErrors
};
