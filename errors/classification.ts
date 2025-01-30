import { ErrorSystem } from "./error.model";
import { generateErrorCode } from "./utils";

export const ERROR_SYSTEM: ErrorSystem = {
  [generateErrorCode("rise-moneyio", "business-logic", 1)]: {
    class: "insufficient-funds",
    description: {
      en: "Your account has insufficient funds to complete this transaction."
    },
    severity: "medium",
    service: "rise-moneyio"
  }
};
