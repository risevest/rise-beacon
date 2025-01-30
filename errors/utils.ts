import { ERROR_CATEGORIES, ERROR_RANGES, LanguageCode, ServiceName } from "./error.model";

import { ERROR_SYSTEM } from "./classification";

/**
 * Generates a unique error code for a specific service and error category.
 *
 * @param service - The name of the service for which the error code is being generated.
 * @param category - The category of the error, which corresponds to a predefined set of error categories.
 * @param sequence - A sequence number used to ensure the uniqueness of the error code within the category.
 * @returns A string representing the generated error code, formatted as a combination of service, category, and sequence.
 */
export function generateErrorCode(
  service: ServiceName,
  category: keyof typeof ERROR_CATEGORIES,
  sequence: number
): string {
  const serviceRange = ERROR_RANGES[service];
  const categoryCode = ERROR_CATEGORIES[category];
  return `${serviceRange.start.toString()[0]}${categoryCode}${sequence.toString().padStart(2, "0")}`;
}

/**
 * Retrieves the error message for a given error code, in the specified language.
 *
 * @param code - The error code for which the message is being retrieved.
 * @param language - The language in which the error message should be retrieved.
 * @returns The error message for the given code and language, or undefined if the language is not supported.
 * @throws {Error} If the error code is unknown.
 */
export function getErrorMessageByLanguage(code: string, language: LanguageCode = "en"): string | undefined {
  const error = ERROR_SYSTEM[code];
  if (!error) {
    throw new Error(`Unknown error code: ${code}`);
  }
  return error.description[language] || error.description.en;
}
