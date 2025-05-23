import { ERROR_CATEGORIES } from "./error.model";
import { ERROR_SYSTEM } from "./classification";
import { AppErrors } from "./errors";


/**
 * A utility class for error operations such as type-checking and introspection.
 *
 * @example
 * // Check what codes are available for validation
 * console.log(ErrorUtils.getAvailableCodesForCategory("validation"));
 * // ["1000", "1001", "1002", "1003"]
 *
 * @example
 * // Validate before throwing
 * if (ErrorUtils.validateInternalStatusCode("1001", "validation")) {
 *   throw new ValidationFailed("1001", details);
 * }
 *
 * @example
 * // Get category from code
 * console.log(ErrorUtils.getCategoryFromInternalCode("1001")); // "validation"
 */
export class ErrorUtils {
  /**
   * Checks if the provided error is an instance of AppErrors.
   * @param error - Any error object
   */
  static isAppError(error: any): error is AppErrors {
    return error instanceof AppErrors;
  }

  /**
   * Retrieves all internal error codes that belong to a specific error category.
   * @param category - One of the predefined error categories
   */
  static getErrorsByCategory(category: keyof typeof ERROR_CATEGORIES): string[] {
    return Object.entries(ERROR_SYSTEM)
      .filter(([_, def]) => def.category === category)
      .map(([code, _]) => code);
  }

  /**
   * Validates that an internal status code belongs to the expected error category.
   * @param internal_status_code - Error code to validate
   * @param expected_category - Expected category of the error
   */
  static validateInternalStatusCode(internal_status_code: string, expected_category: keyof typeof ERROR_CATEGORIES): boolean {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    return errorDef?.category === expected_category;
  }

  /**
   * Retrieves the category for a given internal status code.
   * @param internal_status_code - Internal status code
   */
  static getCategoryFromInternalCode(internal_status_code: string): keyof typeof ERROR_CATEGORIES | null {
    const errorDef = ERROR_SYSTEM[internal_status_code];
    return errorDef?.category || null;
  }

  /**
   * Lists all available internal status codes for a given category.
   * @param category - Error category
   */
  static getAvailableCodesForCategory(category: keyof typeof ERROR_CATEGORIES): string[] {
    return Object.entries(ERROR_SYSTEM)
      .filter(([_, def]) => def.category === category)
      .map(([code, _]) => code);
  }
}
