# @passfast/sdk

Official TypeScript SDK for the PassFast Apple Wallet Pass platform.

## Commands

- `npm run build` — Build with tsup (ESM + CJS + DTS)
- `npm run test` — Run tests with vitest
- `npm run typecheck` — Type-check with tsc --noEmit
- `npm run clean` — Remove dist/

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

## Syncing with OpenAPI spec

When the OpenAPI spec changes, update `src/types.ts` first, then update resource files if return types or method signatures changed. Run `npm run build` and `npm test` to verify.
