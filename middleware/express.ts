import { AppError } from "../errors";
import { SuperErrorCodes } from "../classification";

// Minimal Express-compatible interface — avoids a hard runtime dep on express
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
