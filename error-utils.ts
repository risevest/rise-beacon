import { ERROR_CATEGORIES } from "./error.model";
import { AppError } from "./errors";
import { ERROR_SYSTEM, ServiceCodePrefix, ServiceId, ServiceRegistry } from "./classification";

/**
 * A utility class for error operations such as introspection, validation,
 * and categorization of internal error codes.
 *
 * @example
 * // Check available codes for a category
 * const codes = ErrorUtils.getAvailableCodesForCategory(ERROR_CATEGORIES.validation);
 * console.log(codes); // e.g., ["1000", "1001"]
 *
 * @example
 * // Validate an error instance
 * if (ErrorUtils.isAppError(error)) {
 *   console.error("This is a handled application error:", error);
 * }
 *
 * @example
 * // Group all codes by category
 * const authCodes = ErrorUtils.getErrorsByCategory(ERROR_CATEGORIES.authorization);
 * console.log(authCodes); // e.g., ["3000", "3001"]
 */
export class ErrorUtils {
  /**
   * Checks if the provided error is an instance of AppError.
   * Useful for distinguishing known application-level errors from unknown exceptions.
   *
   * @param error - Any error object
   * @returns True if the error is an AppError, false otherwise.
   */
  static isAppError(error: any): error is AppError {
    return error instanceof AppError;
  }

  /**
   * Retrieves all internal error codes that belong to a specific error category.
   * Useful for filtering or displaying errors grouped by domain.
   *
   * @param category - One of the predefined error categories (enum value)
   * @returns Array of error codes (as strings) belonging to the category
   */
  static getErrorsByCategory(category: ERROR_CATEGORIES): string[] {
    return Object.entries(ERROR_SYSTEM)
      .filter(([_, def]) => def.category === category)
      .map(([code, _]) => code);
  }

  /**
   * Lists all available internal status codes for a given category.
   * This is an alias for getErrorsByCategory for clearer semantics.
   *
   * @param category - One of the predefined error categories (enum value)
   * @returns Array of error codes (as strings) for the category
   */
  static getAvailableCodesForCategory(category: ERROR_CATEGORIES): string[] {
    return Object.entries(ERROR_SYSTEM)
      .filter(([_, def]) => def.category === category)
      .map(([code, _]) => code);
  }

  /**
   * Get service code prefix string like "MIO", "WLT"
   */
  static getServiceCodePrefix(serviceId: ServiceId): ServiceCodePrefix {
    return ServiceRegistry[serviceId]?.code ?? "GEN";
  }

  /**
   * Format a subcode with the service prefix.
   * @example formatSubCode(ServiceId.MONEY_IO, 12) → "MIO-012"
   */
  static formatSubCode(serviceId: ServiceId, subCode: number): string {
    const prefix = this.getServiceCodePrefix(serviceId);
    return `${prefix}-${subCode.toString().padStart(3, "0")}`;
  }

  /**
   * Parse a formatted subcode like "WLT-001" into { serviceId, subCode }
   */
  static parseSubCode(formatted: string): { serviceId: ServiceId; subCode: number } {
    const match = formatted.match(/^([A-Z]{3})-(\d{3})$/);
    if (!match) throw new Error(`Invalid subcode format: ${formatted}`);

    const [, prefix, codeStr] = match;
    const subCode = parseInt(codeStr, 10);

    const entry = Object.values(ServiceRegistry).find((ref) => ref.code === prefix);
    const serviceId = entry?.id ?? ServiceId.DEFAULT;

    return { serviceId, subCode };
  }
}
