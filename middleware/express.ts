import { AppError, BeaconError, toBeaconError } from "../errors";
import { SuperErrorCodes } from "../classification";
import { SerializedError } from "../error.model";

// Minimal Express-compatible interface, avoids a hard runtime dep on express
interface Req {
  [key: string]: any;
}
interface Res {
  status(code: number): this;
  json(body: any): this;
  headersSent?: boolean;
}
type Next = (err?: any) => void;

const HTTP_STATUS: Record<SuperErrorCodes, number> = {
  [SuperErrorCodes.VALIDATION_ERROR]: 422,
  [SuperErrorCodes.AUTHENTICATION_ERROR]: 401,
  [SuperErrorCodes.AUTHORIZATION_ERROR]: 403,
  [SuperErrorCodes.BUSINESS_LOGIC_ERROR]: 422,
  [SuperErrorCodes.EXTERNAL_SERVICE_ERROR]: 502,
  [SuperErrorCodes.SYSTEM_ERROR]: 500
};

/**
 * Express error-handling middleware for AppError instances.
 *
 * Register this as the last middleware in your Express app:
 * ```ts
 * import { beaconErrorHandler } from "rise-beacon/middleware/express";
 * app.use(beaconErrorHandler);
 * ```
 *
 * AppErrors are serialized via `.toJSON()` and given the appropriate HTTP
 * status derived from their super_code. All other errors fall through to a
 * generic 500 response.
 */
export function beaconErrorHandler(err: unknown, _req: Req, res: Res, next: Next): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    const status = HTTP_STATUS[err.superCode] ?? 500;
    res.status(status).json(err.toJSON());
    return;
  }

  res.status(500).json({
    message: "An unexpected error occurred."
  });
}

/**
 * Minimal shape of a `BeaconSystem` needed by the middleware.
 * Kept structural so any `defineErrorSystem` result (regardless of its
 * config generics) can be passed in.
 */
export interface BeaconSystemLike {
  httpStatusFor(superCode: number): number;
  resolve?(superCode: number, subCode: number): { httpStatus: number } | null;
}

export interface BeaconErrorHandlerOptions {
  /** Called with every error before the response is sent. Intended for logging and reporting. */
  onError?: (err: unknown, req: Req) => void;

  /** Override the response body, e.g. to emit an RFC 9457 problem-details shape. */
  formatError?: (serialized: SerializedError, err: AppError) => unknown;

  /**
   * When false (the default), system errors (super code 6000) and unknown thrown
   * values respond with a generic message instead of the internal one.
   */
  exposeSystemErrors?: boolean;

  /** Message used when a system/unknown error is redacted. */
  fallbackMessage?: string;
}

/**
 * Builds an Express error-handling middleware bound to an error system
 * created with `defineErrorSystem`.
 *
 * Differences from the v1 `beaconErrorHandler`:
 * - HTTP status comes from each category's `httpStatus` in the registry
 *   (org-defined categories included), not just the built-in map.
 * - Unknown (non-AppError) errors are normalized via `toBeaconError`, so
 *   clients receive the beacon shape for every failure.
 * - Hooks for logging (`onError`) and body shaping (`formatError`).
 *
 * ```ts
 * import { createBeaconErrorHandler } from "rise-beacon/middleware/express";
 * import { beacon } from "./errors.config";
 *
 * app.use(createBeaconErrorHandler(beacon, { onError: (err) => logger.error(err) }));
 * ```
 */
export function createBeaconErrorHandler(system?: BeaconSystemLike, options: BeaconErrorHandlerOptions = {}) {
  const fallbackMessage = options.fallbackMessage ?? "An unexpected error occurred.";

  return function beaconErrorHandlerV2(err: unknown, req: Req, res: Res, next: Next): void {
    if (res.headersSent) {
      next(err);
      return;
    }

    try {
      options.onError?.(err, req);
    } catch {
      // a failing onError hook must not break the error response
    }

    const wasUnknown = !(err instanceof AppError);
    const appError = wasUnknown ? toBeaconError(err, fallbackMessage) : err;

    const status =
      appError instanceof BeaconError
        ? appError.httpStatus
        : system?.resolve?.(Number(appError.superCode), Number(appError.subCode))?.httpStatus ??
          system?.httpStatusFor(Number(appError.superCode)) ??
          HTTP_STATUS[appError.superCode] ??
          500;

    let body: unknown = appError.toJSON();
    const isSystemError = Number(appError.superCode) === SuperErrorCodes.SYSTEM_ERROR;
    if ((wasUnknown || isSystemError) && !options.exposeSystemErrors) {
      body = { ...(body as SerializedError), message: fallbackMessage };
    }

    if (options.formatError) {
      body = options.formatError(body as SerializedError, appError);
    }

    res.status(status).json(body);
  };
}
