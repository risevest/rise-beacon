# rise-beacon

Structured error classification and handling for Node.js services.

Your server throws typed, categorised errors. Your client receives the same error shape and can handle it with the same type definitions.

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

// business logic, with optional metadata
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

## Server → client, end to end

The same error shape flows from your Express route to your frontend, with no manual wiring on either side.

**Server** throws a typed error and lets the middleware serialize it:

```ts
import express from "express";
import { BusinessLogicFailed, BusinessLogicSubCodes } from "rise-beacon";
import { beaconErrorHandler } from "rise-beacon/middleware/express";

const app = express();

app.post("/withdraw", (req, res) => {
  if (req.body.amount > wallet.balance) {
    throw new BusinessLogicFailed(BusinessLogicSubCodes.INSUFFICIENT_FUNDS, "Your balance is too low", {
      available: wallet.balance
    });
  }
  res.json({ ok: true });
});

app.use(beaconErrorHandler); // must be last
```

**Client** fetches, parses the response, and handles it by category:

```ts
import { parseBeaconError, matchBeaconError } from "rise-beacon/client";

const response = await fetch("/withdraw", { method: "POST", body: JSON.stringify({ amount: 5000 }) });
const err = parseBeaconError(await response.json());

matchBeaconError(err, {
  onBusiness: (e) => toast.error(e.message), // "Your balance is too low"
  onFallback: () => toast.error("Something went wrong")
});
```

No shared config is required for this flow, it works with the built-in taxonomy out of the box. See [Define your own error codes](#define-your-own-error-codes-v2) below for org-defined categories shared between server and client.

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

`ExternalServiceFailed` also accepts an optional `originalError` as the fourth argument. Its message is included in `toJSON()` as `original_error`.

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

## Client usage (`rise-beacon/client`)

A browser-safe subpath for frontend code. No Node.js dependencies, so it is safe to import in any web app, React, Vue, or plain fetch.

### Parse a response

`parseBeaconError` accepts any HTTP response body and returns a typed `ParsedBeaconError`, or `null` if the response is not a beacon error.

```ts
import { parseBeaconError } from "rise-beacon/client";

// with fetch
const body = await response.json();
const err = parseBeaconError(body);

// with axios
const err = parseBeaconError(error.response?.data);
```

### Match by category

`matchBeaconError` lets you handle each error category with a dedicated callback. All handlers are optional, and anything unhandled falls to `onFallback`.

```ts
import { parseBeaconError, matchBeaconError } from "rise-beacon/client";

const err = parseBeaconError(await response.json());

matchBeaconError(err, {
  onValidation: (e) => toast.error(e.message),
  onAuth: () => router.push("/login"),
  onAuthorization: () => toast.error("You don't have permission to do that"),
  onBusiness: (e) => toast.error(e.message),
  onFallback: () => toast.error("Something went wrong, please try again"),
});
```

Async handlers work too. TypeScript infers the return type:

```ts
await matchBeaconError(err, {
  onAuth: async () => {
    await refreshToken();
    router.push("/login");
  },
  onFallback: async () => captureException(err),
});
```

### Check specific sub-codes

The sub-code enums are re-exported from `rise-beacon/client` so you can handle specific cases without importing from the server entry point:

```ts
import { parseBeaconError, BusinessLogicSubCodes } from "rise-beacon/client";
import { ErrorUtils } from "rise-beacon/client";

const err = parseBeaconError(body);

if (err && ErrorUtils.parseSubCode(err.subCode).subCode === BusinessLogicSubCodes.INSUFFICIENT_FUNDS) {
  showTopUpModal();
}
```

### ParsedBeaconError shape

```ts
interface ParsedBeaconError {
  message: string;
  superCode: SuperErrorCodes;  // 1000 | 2000 | 3000 | 4000 | 5000 | 6000
  subCode: string;             // "PREFIX-NNN"
  timestamp?: string;
  meta?: Record<string, any>;
  originalError?: string;      // present for upstream service failures
}
```

## Define your own error codes (v2)

The built-in taxonomy works out of the box, but your organization can define its own categories and codes with `defineErrorSystem`. Declare the system once in a shared module and import it from both your backend and frontend. The names you define flow through factories, parsing, and matching with full autocomplete.

If your frontend and backend live in separate repositories, publish the shared config as a small internal package (for example `@acme/errors`) and depend on it from both sides.

### 1. Shared config: `errors.config.ts`

```ts
import { defineErrorSystem, beaconDefaultCategories } from "rise-beacon"; // or "rise-beacon/client"

export const beacon = defineErrorSystem({
  prefix: "PAY",
  categories: {
    ...beaconDefaultCategories, // optional: include the built-in 1000-6000 taxonomy
    WALLET: {
      superCode: 7000,
      httpStatus: 422,
      subCodes: {
        FROZEN: { code: 1, message: "Wallet is frozen", docsUrl: "https://docs.acme.com/errors/wallet-frozen" },
        LIMIT_EXCEEDED: { code: 2, message: "Wallet limit exceeded" }
      }
    }
  }
});
```

Numeric codes are explicit, so renaming a key never changes what goes over the wire. A sub-code can set its own `httpStatus` to override the category's (the built-in taxonomy does this: `RESOURCE_NOT_FOUND` responds with 404 and rate-limit codes with 429). Duplicate super codes or sub-code numbers throw at definition time.

### 2. Server: raise errors

Most error-raising on a server is guarding: a value must exist, or a condition must hold. The system object has helpers for each shape, all keyed by the same typed `"CATEGORY.SUB_CODE"` strings.

```ts
import { beacon } from "./errors.config";

app.post("/withdraw", async (req, res) => {
  // value must exist, otherwise throw (return type is narrowed to non-null)
  const wallet = beacon.orThrow(await findWallet(req.body.walletId), "VALIDATION.RESOURCE_NOT_FOUND");

  // condition must hold, otherwise throw
  beacon.assert(!wallet.frozen, "WALLET.FROZEN", { meta: { walletId: wallet.id } });
  beacon.assert(wallet.balance >= amount, "BUSINESS_LOGIC.INSUFFICIENT_FUNDS", { meta: { available: wallet.balance } });

  // throw directly
  beacon.throw("WALLET.LIMIT_EXCEEDED");

  // or create without throwing
  return Promise.reject(beacon.error("WALLET.FROZEN"));
});
```

The factory form is also available, and every call site accepts either positional arguments or an options object:

```ts
throw beacon.errors.WALLET.FROZEN();                                // default message
throw beacon.errors.WALLET.FROZEN("custom message", { walletId }); // positional
throw beacon.errors.WALLET.FROZEN({ meta: { walletId } });          // meta without a message
```

Modules that mostly deal in one domain can destructure once:

```ts
const { FROZEN, LIMIT_EXCEEDED } = beacon.errors.WALLET;
throw FROZEN();
```

### 3. Server: handle errors

```ts
import { createBeaconErrorHandler } from "rise-beacon/middleware/express";
import { beacon } from "./errors.config";

app.use(
  createBeaconErrorHandler(beacon, {
    onError: (err, req) => logger.error(err), // logging and reporting hook
    // formatError: (body, err) => ({ ... }), // reshape the response body
    // exposeSystemErrors: true,              // default false: system errors get a generic message
  })
);
```

HTTP status comes from the registry. Unknown thrown values are normalized into the same response shape, so clients see one format for every failure. Factory errors extend `AppError`, so the v1 `beaconErrorHandler` and `ErrorUtils.isAppError` keep working too.

Note for Express 4: errors thrown in `async` handlers do not reach error middleware on their own. Use Express 5, or a wrapper like `express-async-errors`.

### 4. Client: parse, check, match

```ts
import { createBeaconClient } from "rise-beacon/client";
import { beacon } from "./errors.config";

const client = createBeaconClient(beacon);
```

`handle` parses a response body and dispatches it in one call:

```ts
client.handle(await response.json(), {
  WALLET: {
    FROZEN: () => showUnfreezeModal(),
    _: (e) => toast.error(e.message),           // any other WALLET code
  },
  VALIDATION: (e) => toast.error(e.message),    // whole-category handler
  _: () => toast.error("Something went wrong"), // anything else, including non-beacon errors
});
```

`parse`, `match`, and `is` are available separately when you need the parsed error itself:

```ts
const err = client.parse(await response.json()); // BeaconClientError | null

if (err?.is("WALLET.FROZEN")) showUnfreezeModal();

client.is(body, "WALLET.FROZEN"); // parse and check in one call
```

`parse` rehydrates the wire JSON into an `Error` subclass carrying the resolved `category` and `code` names, `meta`, `timestamp`, and the `docsUrl` from your registry. All of it is typed against your config: `err.category` is a union of your category names, and a mistyped key in `is` or `match` fails to compile. Codes the client's registry does not know yet (for example, when the server ships new ones first) still parse with `category: "UNKNOWN"` and fall through to `_`.

### Compatibility

The wire format is unchanged from v1. Names are layered on top of the same `super_code` and `"PREFIX-NNN"` numbers, so a v1 server works with a v2 client and vice versa. The entire v1 API (error classes, `setServicePrefix`, `beaconErrorHandler`, `parseBeaconError`, `matchBeaconError`) is untouched.

## Package entries

| Import path | For | Contains |
|---|---|---|
| `rise-beacon` | Server (Node.js) | Error classes, `setServicePrefix`, `ErrorUtils`, `defineErrorSystem`, `beaconDefaultCategories`, `toBeaconError` |
| `rise-beacon/client` | Browser / frontend | `parseBeaconError`, `matchBeaconError`, `createBeaconClient`, `defineErrorSystem`, enums, types |
| `rise-beacon/middleware/express` | Express apps | `beaconErrorHandler`, `createBeaconErrorHandler` |

## License

MIT
