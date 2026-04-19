# rise-beacon

Structured error classification and handling for Node.js services.

Provides a consistent error hierarchy, typed sub-codes, and serialization so every service in your platform speaks the same error language — and clients always know what went wrong.

## Install

```bash
npm install rise-beacon
# or
yarn add rise-beacon
```

## Quick start

### 1. Set your service prefix (once, at startup)

```ts
import { setServicePrefix } from "rise-beacon";

setServicePrefix("PAY"); // sub-codes will be formatted as "PAY-001", "PAY-007", etc.
```

### 2. Throw structured errors

```ts
import { ValidationFailed, AuthenticationFailed, BusinessLogicFailed } from "rise-beacon";
import { ValidationSubCodes, AuthenticationSubCodes, BusinessLogicSubCodes } from "rise-beacon";

// validation
throw new ValidationFailed(ValidationSubCodes.REQUIRED_FIELD_MISSING, "Email is required");

// authentication
throw new AuthenticationFailed(AuthenticationSubCodes.TOKEN_EXPIRED);

// business logic — with optional metadata
throw new BusinessLogicFailed(
  BusinessLogicSubCodes.INSUFFICIENT_FUNDS,
  "Your balance is too low for this transaction",
  { available: 500, required: 1200 }
);
```

### 3. Serialize errors for HTTP responses

Every `AppError` has a `toJSON()` method that produces a consistent response shape:

```ts
const err = new ValidationFailed(ValidationSubCodes.INVALID_FORMAT, "Invalid phone number");

console.log(err.toJSON());
// {
//   message: "Invalid phone number",
//   data: {
//     super_code: 1000,
//     sub_code: "PAY-004",
//     timestamp: "2024-04-19T10:00:00.000Z"
//   }
// }
```

## Express middleware

Register `beaconErrorHandler` as the last middleware in your Express app to automatically serialize any `AppError` thrown in your routes:

```ts
import express from "express";
import { beaconErrorHandler } from "rise-beacon/middleware/express";

const app = express();

app.get("/pay", (req, res) => {
  throw new BusinessLogicFailed(BusinessLogicSubCodes.INSUFFICIENT_FUNDS);
});

app.use(beaconErrorHandler); // must be last
```

HTTP status is derived from the error category:

| Super code | Category | HTTP status |
|---|---|---|
| 1000 | Validation | 422 |
| 2000 | Authentication | 401 |
| 3000 | Authorization | 403 |
| 4000 | Business logic | 422 |
| 5000 | External service | 502 |
| 6000 | System | 500 |

## Error classes

| Class | Super code | When to use |
|---|---|---|
| `ValidationFailed` | 1000 | Bad input, missing fields, wrong format |
| `AuthenticationFailed` | 2000 | Invalid credentials, expired/invalid tokens |
| `AuthorizationFailed` | 3000 | Access denied, missing permissions |
| `BusinessLogicFailed` | 4000 | Domain rule violations, resource state issues |
| `ExternalServiceFailed` | 5000 | Downstream API failures, timeouts |
| `SystemLevelFailed` | 6000 | Database failures, unexpected system errors |

All classes extend `AppError` and accept `(subCode, message?, meta?)`.

`ExternalServiceFailed` also accepts an optional `originalError` as the fourth argument — its message is included in `toJSON()` as `original_error`.

## Utilities

```ts
import { ErrorUtils, ERROR_CATEGORIES } from "rise-beacon";

// type guard
if (ErrorUtils.isAppError(err)) { ... }

// format / parse sub-codes manually
ErrorUtils.formatSubCode("PAY", 7)    // → "PAY-007"
ErrorUtils.parseSubCode("PAY-007")    // → { prefix: "PAY", subCode: 7 }

// list all codes for a category
ErrorUtils.getErrorsByCategory(ERROR_CATEGORIES.validation) // → ["0", "1", ...]
```

## Response shape

```ts
interface SerializedError {
  message: string;
  data: {
    super_code: number;   // broad category: 1000 | 2000 | 3000 | 4000 | 5000 | 6000
    sub_code: string;     // "PREFIX-NNN"
    timestamp: string;    // ISO 8601
    meta?: Record<string, any>;
  };
}
```

## License

MIT
