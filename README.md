# @passfast/sdk

Official TypeScript SDK for the [PassFast](https://passfa.st) Apple Wallet & Google Wallet Pass platform.

- Zero dependencies — uses `globalThis.fetch`
- Works in **Node.js 18+**, **Deno**, **Bun**, and **Supabase Edge Functions**
- Dual ESM/CJS output
- Full TypeScript types

## Installation

```bash
npm install @passfast/sdk
```

**Deno / Supabase Edge Functions:**

```typescript
import { PassFast } from "npm:@passfast/sdk";
```

## Quick Start

```typescript
import { PassFast } from "@passfast/sdk";

const pf = new PassFast("sk_live_...");

// Generate an Apple Wallet pass
const { passId, pkpassData } = await pf.passes.generate({
  template_id: "tmpl_...",
  serial_number: "MBR-001",
  data: { name: "Jane Doe", points: "1250" },
});

// List passes
const passes = await pf.passes.list({ status: "active", limit: 10 });

// Update a pass (triggers push notification)
await pf.passes.update(passId, {
  data: { points: "1500" },
  push_update: true,
});
```

## Configuration

```typescript
const pf = new PassFast("sk_live_...", {
  appId: "app_...",   // required if org has multiple apps
  timeout: 15_000,    // request timeout in ms (default: 30000)
});
```

## Resources

### Passes

```typescript
// Generate an Apple Wallet pass (.pkpass binary)
const { passId, pkpassData, existed } = await pf.passes.generate({
  template_id: "...",
  serial_number: "MBR-001",
  data: { name: "Jane Doe" },
  get_or_create: true,
});

// Generate a Google Wallet pass
const { id, save_url } = await pf.passes.generate({
  template_id: "...",
  serial_number: "MBR-001",
  data: { name: "Jane Doe" },
  wallet_type: "google",
});

// Generate both Apple and Google passes at once
const { apple, google, warnings } = await pf.passes.generate({
  template_id: "...",
  serial_number: "MBR-001",
  data: { name: "Jane Doe" },
  wallet_type: "both",
});

// List passes (with optional wallet_type filter)
const passes = await pf.passes.list({ status: "active", wallet_type: "apple" });

// Get, download, update, void by ID
const pass = await pf.passes.get(passId);
const binary = await pf.passes.download(passId);
await pf.passes.update(passId, { data: { points: "2000" }, push_update: true });
await pf.passes.void(passId);

// Operations by serial number (with optional wallet_type)
const pass = await pf.passes.getBySerial("MBR-001", { wallet_type: "google" });
await pf.passes.updateBySerial("MBR-001", { data: { points: "2000" } });
await pf.passes.voidBySerial("MBR-001");
const binary = await pf.passes.downloadBySerial("MBR-001");
```

### Pass Sharing

```typescript
// Create a share token for public distribution
const { share_token, share_url } = await pf.passSharing.createShareToken(passId);

// Get public metadata for a shared pass (no auth required)
const metadata = await pf.passSharing.getMetadata(share_token);

// Download shared .pkpass (no auth required)
const binary = await pf.passSharing.download(share_token);
```

### Webhook Events

```typescript
const events = await pf.webhookEvents.list({
  event_type: "pass.created",
  delivery_status: "failed",
  limit: 50,
});
```

## Error Handling

All errors extend `PassFastError` with `status`, `code`, and optional `details`.

```typescript
import { PassFast, AuthenticationError, NotFoundError, ValidationError } from "@passfast/sdk";

try {
  await pf.passes.generate({ /* ... */ });
} catch (err) {
  if (err instanceof AuthenticationError) {
    // Invalid or expired API key (401)
  } else if (err instanceof NotFoundError) {
    // Template or pass not found (404)
  } else if (err instanceof ValidationError) {
    // Invalid request data (400) — check err.details
    console.log(err.details);
  }
}
```

| Error Class | HTTP Status | Code |
|-------------|-------------|------|
| `ValidationError` | 400 | `bad_request` |
| `AuthenticationError` | 401 | `unauthorized` |
| `PermissionError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `RateLimitError` | 429 | `rate_limited` |
| `WebhookError` | 502 | `webhook_error` |
| `ServerError` | 500 | `internal_error` |

## Supabase Edge Function Example

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PassFast } from "npm:@passfast/sdk";

const pf = new PassFast(Deno.env.get("PASSFAST_SECRET_KEY")!);

serve(async (req) => {
  const { serial_number, name } = await req.json();

  const { passId, pkpassData } = await pf.passes.generate({
    template_id: "...",
    serial_number,
    data: { name },
  });

  return new Response(pkpassData, {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": `attachment; filename="${serial_number}.pkpass"`,
    },
  });
});
```

## License

MIT
