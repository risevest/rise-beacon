import { ERROR_CATEGORIES, ErrorDefinition, LanguageCode } from "./error.model";

import { ERROR_SYSTEM } from "./classification";
import { getErrorMessageByLanguage } from "./utils";

/**
 * This wraps errors thrown by the application and provides additional information about the error.
 * eg.
 * throw new ErrorWrapper("1000"); // External wallet not found.
 * throw new ErrorWrapper("1000", "fr"); // Portefeuille externe non trouvé.
 *
 * You can also access the error definition and category:
 * const error = new ErrorWrapper("1000");
 * console.log(error.getMessage()); // External wallet not found.
 */
export class ErrorWrapper extends Error {
  public readonly error_definition: ErrorDefinition;

  /**
   * Constructs an instance of ErrorWrapper with the specified error code and language.
   *
   * @param code - The error code for which the ErrorWrapper is being created.
   * @param language - The language in which the error message should be retrieved. Defaults to English ("en").
   * @throws {Error} If the provided error code is unknown.
   */

  constructor(public code: string, public language: LanguageCode = "en") {
    const errorDef = ERROR_SYSTEM[code];
    if (!errorDef) {
      throw new Error(`Unknown error code: ${code}`);
    }
    super(getErrorMessageByLanguage(code, language));
    this.name = errorDef.category;
    this.error_definition = errorDef;
  }

  getCategory(): keyof typeof ERROR_CATEGORIES {
    return this.error_definition.category;
  }

  getMessage(): string {
    return this.error_definition.description[this.language] || this.error_definition.description.en!;
  }
}
