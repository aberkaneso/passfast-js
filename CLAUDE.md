# @passfast/sdk

Official TypeScript SDK for the PassFast Apple Wallet Pass platform.

## Commands

- `npm run build` — Build with tsup (ESM + CJS + DTS)
- `npm run test` — Run tests with vitest
- `npm run typecheck` — Type-check with tsc --noEmit
- `npm run clean` — Remove dist/

## Publishing

- Published as `@passfast/sdk` on npm (public, scoped under `@passfast` org)
- Bump version with `npm version patch|minor|major --no-git-tag-version`
- Build before publishing: `npm run build`
- Publish: `npm publish --access public` (requires security key 2FA — must run interactively)

## Project Structure

```
src/
  index.ts          — Public entry point, re-exports client + types
  client.ts         — PassFast client class, wires up resources
  http-client.ts    — Fetch-based HTTP client (auth, headers, error handling)
  types.ts          — All interfaces, enums, request/response types
  resources/        — One file per API resource (passes, templates, images, etc.)
  __tests__/        — Vitest tests mirroring resource structure
```

## Conventions

- Types live in `src/types.ts` — models, request types, response types, enums
- Each resource class takes an `HttpClient` via constructor injection
- Tests use `vi.fn()` mock HTTP client — they verify method/path/body/query, not real HTTP
- Snake_case for all API fields (matches OpenAPI spec)
- No runtime dependencies — only devDependencies (tsup, typescript, vitest)

## Security

- All dynamic path parameters must use `encodeURIComponent()` (prevents path traversal / query injection)
- `baseUrl` is hardcoded internally — not user-configurable (PassFast is hosted-only)
- SDK headers (`Authorization`) are spread last to prevent caller override
- Sensitive fields (`authentication_token`, `webhook_secret`, `webhook_secret_raw`) have JSDoc `@remarks` warnings

## API Coverage

### Pass operations
- CRUD by ID: `generate`, `list`, `get`, `update`, `void`, `delete`, `download`
- CRUD by serial number: `getBySerial`, `updateBySerial`, `deleteBySerial`, `downloadBySerial`

### All delete/destructive endpoints return response data
- No resource methods return `void` — all return typed response objects (e.g., `DeletePassResponse`, `DeleteTemplateResponse`, `RemoveMemberResponse`, etc.)

## Syncing with OpenAPI spec

When the OpenAPI spec changes, update `src/types.ts` first, then update resource files if return types or method signatures changed. Run `npm run build` and `npm test` to verify.
