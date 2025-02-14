import { ERROR_SYSTEM } from "./classification";
import { LanguageCode } from "./error.model";

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
