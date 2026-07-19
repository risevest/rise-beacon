# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-04-19

### Added
- `rise-beacon/client` subpath: a browser-safe entry point with zero Node.js dependencies
- `parseBeaconError(body: unknown): ParsedBeaconError | null` parses any HTTP response body and returns a typed error object, or `null` if the response is not a beacon error. Works with `fetch`, axios, or any HTTP client
- `matchBeaconError(error, handlers)` pattern-matches a parsed error by category. Each handler is optional; unhandled categories fall through to `onFallback`. Supports sync and async handlers, and TypeScript infers the return type from your handlers
- `ParsedBeaconError` interface: camelCase typed representation of a received beacon error, including `superCode`, `subCode`, `message`, `timestamp`, `meta`, and `originalError`
- `BeaconErrorHandlers` interface, exported for consumers who build wrapper utilities around `matchBeaconError`
- All sub-code enums and `SerializedError` types are re-exported from `rise-beacon/client` so frontend code never needs to import from the server entry point
- Org-defined error systems via `defineErrorSystem({ prefix, categories })`. Declare your own categories and sub-codes (names with explicit numeric wire codes, default messages, HTTP statuses, optional `docsUrl`) in one shared config imported by both server and client. Names are preserved at the type level and flow into factories, parsing, and matching. Duplicate super codes or sub-code numbers throw at definition time
- `beaconDefaultCategories`: the built-in 1000-6000 taxonomy expressed as registry categories, ready to spread into `defineErrorSystem`. `RESOURCE_NOT_FOUND` codes respond with 404 and rate-limit codes with 429; sub-code definitions can override their category's HTTP status
- Typed server factories: `throw beacon.errors.WALLET.FROZEN("msg", { meta })` returns a `BeaconError`, which extends `AppError` so `instanceof` checks and the v1 middleware keep working. Factories also accept an options object: `FROZEN({ meta })`
- Guard helpers on the system object, keyed by typed `"CATEGORY.SUB_CODE"` strings: `beacon.assert(condition, key)` throws when the condition is falsy, `beacon.orThrow(value, key)` throws on nullish values and narrows the return type, `beacon.throw(key)` throws directly, and `beacon.error(key)` creates without throwing
- `toBeaconError(unknown)`: normalizes arbitrary thrown values into a system-category `AppError`, preserving the original stack and `cause`
- `createBeaconErrorHandler(system, options)`: configurable Express middleware. HTTP status comes from the registry (custom categories included), unknown errors are normalized to the beacon shape, `onError` hooks in logging, `formatError` overrides the body, and system-error messages are redacted by default (`exposeSystemErrors: false`)
- `createBeaconClient(system)`: registry-bound client. `parse` rehydrates wire JSON into a `BeaconClientError` with resolved category and code names plus `docsUrl`, `match` dispatches per-sub-code and per-category handlers with `_` fallbacks at both levels, `handle` combines parse and match in one call, and `is` checks a raw body against one key
- `BeaconClientError`: an `Error` subclass with a typed `.is("CATEGORY.SUB_CODE")` guard. `category` and `code` are typed as unions of the registry names. Unrecognized but beacon-shaped responses still parse with `category: "UNKNOWN"` for forward compatibility
- `ErrorUtils` is now exported from `rise-beacon/client`

### Fixed
- `matchBeaconError` no longer invokes `onFallback` when a category handler exists but returns `undefined` (previously a handler that only fired a toast would also trigger the fallback)
- `exports` map now lists `types` first and includes a `default` condition, fixing resolution under `moduleResolution: bundler` and ESM-first setups

### Notes
The server entry point (`rise-beacon`) is unchanged and the wire format (`super_code` number, `"PREFIX-NNN"` sub-code) is identical. Org-defined names are layered on top of the numbers, so v1 servers and v2 clients interoperate in both directions. Nothing breaking for existing consumers.

---

## [1.0.0] - 2026-04-19

### Added
- Six structured error classes: `ValidationFailed`, `AuthenticationFailed`, `AuthorizationFailed`, `BusinessLogicFailed`, `ExternalServiceFailed`, `SystemLevelFailed`
- Hierarchical error code system: `SuperErrorCodes` (1000–6000) paired with category-specific sub-code enums
- `AppError` base class with `toJSON()` serialization, timestamp, and optional metadata
- `setServicePrefix(prefix)` — call once at app startup to namespace all sub-codes (e.g. `"PAY"` → `"PAY-007"`)
- `ErrorUtils` static helpers: `isAppError`, `getErrorsByCategory`, `formatSubCode`, `parseSubCode`
- `ExternalServiceFailed` captures and surfaces the original upstream error message
- Express error-handling middleware via `rise-beacon/middleware/express` (optional, no hard dep)
- Full TypeScript declarations and source maps in `dist/`
- MIT license

### Changed
- Service prefix is now fully generic — any uppercase string (e.g. `"PAY"`, `"AUTH"`, `"USR"`). Previously contained a hardcoded registry of Rise-internal service codes
- `ErrorUtils.parseSubCode` now returns `{ prefix: string, subCode: number }` instead of a Rise-specific `serviceId`
- `http-status-codes` removed as a runtime dependency (was unused)
- Dev dependencies pinned to exact versions for reproducible builds

### Notes
This is the initial open-source release. The internal Rise service registry (`ServiceId`, `ServiceRegistry`) has been removed in favour of the generic prefix system.
