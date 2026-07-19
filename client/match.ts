import { SuperErrorCodes } from "../classification";
import { ParsedBeaconError } from "./types";

type Handler<T> = (err: ParsedBeaconError) => T;

export interface BeaconErrorHandlers<T> {
  /** 1000: bad input, missing fields, wrong format */
  onValidation?: Handler<T>;
  /** 2000: invalid credentials, expired or invalid tokens */
  onAuth?: Handler<T>;
  /** 3000: access denied, missing permissions */
  onAuthorization?: Handler<T>;
  /** 4000: domain rule violations, resource state issues */
  onBusiness?: Handler<T>;
  /** 5000: downstream API failures, timeouts */
  onExternal?: Handler<T>;
  /** 6000: database failures, unexpected system errors */
  onSystem?: Handler<T>;
  /**
   * Catches anything not handled by a specific handler above,
   * including `null` (non-beacon errors).
   */
  onFallback?: (err: ParsedBeaconError | null) => T;
}

/**
 * Pattern-matches a parsed beacon error against a set of category handlers.
 * Each handler is optional, and unmatched categories fall through to `onFallback`.
 * Returns `undefined` if no handler matches and no fallback is provided.
 *
 * Handlers can be sync or async. TypeScript infers the return type from your handlers.
 *
 * @example
 * const result = matchBeaconError(parseBeaconError(body), {
 *   onValidation: (err) => toast.error(err.message),
 *   onAuth: () => router.push("/login"),
 *   onFallback: () => toast.error("Something went wrong"),
 * });
 */
export function matchBeaconError<T>(
  error: ParsedBeaconError | null,
  handlers: BeaconErrorHandlers<T>
): T | undefined {
  if (error === null) {
    return handlers.onFallback?.(null);
  }

  // Dispatch on handler presence rather than return value, so a handler that
  // returns undefined does not also trigger the fallback.
  switch (error.superCode) {
    case SuperErrorCodes.VALIDATION_ERROR:
      return handlers.onValidation ? handlers.onValidation(error) : handlers.onFallback?.(error);
    case SuperErrorCodes.AUTHENTICATION_ERROR:
      return handlers.onAuth ? handlers.onAuth(error) : handlers.onFallback?.(error);
    case SuperErrorCodes.AUTHORIZATION_ERROR:
      return handlers.onAuthorization ? handlers.onAuthorization(error) : handlers.onFallback?.(error);
    case SuperErrorCodes.BUSINESS_LOGIC_ERROR:
      return handlers.onBusiness ? handlers.onBusiness(error) : handlers.onFallback?.(error);
    case SuperErrorCodes.EXTERNAL_SERVICE_ERROR:
      return handlers.onExternal ? handlers.onExternal(error) : handlers.onFallback?.(error);
    case SuperErrorCodes.SYSTEM_ERROR:
      return handlers.onSystem ? handlers.onSystem(error) : handlers.onFallback?.(error);
    default:
      return handlers.onFallback?.(error);
  }
}
