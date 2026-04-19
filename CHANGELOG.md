# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-04-19

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
