import { ERROR_SYSTEM } from './classification';
import { ERROR_CATEGORIES } from './error.model';
import { AppError } from './errors';

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
}
