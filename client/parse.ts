import { SuperErrorCodes } from "../classification";
import { ParsedBeaconError } from "./types";

function isValidSuperCode(code: unknown): code is SuperErrorCodes {
  return typeof code === "number" && Object.values(SuperErrorCodes).includes(code as SuperErrorCodes);
}

/**
 * Parses an unknown HTTP response body and returns a typed `ParsedBeaconError`
 * if it matches the beacon error shape, or `null` if it does not.
 *
 * Works with any HTTP client. Pass the parsed JSON body directly:
 *
 * @example
 * // fetch
 * const body = await response.json();
 * const err = parseBeaconError(body);
 *
 * @example
 * // axios
 * const err = parseBeaconError(error.response?.data);
 */
export function parseBeaconError(body: unknown): ParsedBeaconError | null {
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as any).message !== "string" ||
    typeof (body as any).data !== "object" ||
    (body as any).data === null
  ) {
    return null;
  }

  const { message, data, original_error } = body as any;

  if (!isValidSuperCode(data.super_code) || typeof data.sub_code !== "string") {
    return null;
  }

  return {
    message,
    superCode: data.super_code,
    subCode: data.sub_code,
    ...(typeof data.timestamp === "string" && { timestamp: data.timestamp }),
    ...(data.meta && { meta: data.meta }),
    ...(typeof original_error === "string" && { originalError: original_error })
  };
}
