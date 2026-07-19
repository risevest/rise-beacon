import { SuperErrorCodes } from "../classification";

/**
 * A parsed, typed representation of a beacon error response received by a client.
 * Produced by `parseBeaconError` and consumed by `matchBeaconError`.
 */
export interface ParsedBeaconError {
  message: string;
  superCode: SuperErrorCodes;
  subCode: string;
  timestamp?: string;
  meta?: Record<string, any>;
  /** Present when the server error originated from an upstream service failure */
  originalError?: string;
}
