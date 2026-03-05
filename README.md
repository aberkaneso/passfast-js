# @passfast/sdk

Official TypeScript SDK for the [PassFast](https://passfa.st) Apple Wallet Pass platform.

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

// Generate a pass
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
});
```

## Configuration

```typescript
const pf = new PassFast("sk_live_...", {
  orgId: "org_...",   // required for JWT auth
  appId: "app_...",   // required if org has multiple apps
  timeout: 15_000,    // request timeout in ms (default: 30000)
});
```

## Resources

### Passes

```typescript
// Generate a .pkpass binary
const { passId, pkpassData, existed } = await pf.passes.generate({
  template_id: "...",
  serial_number: "MBR-001",
  data: { name: "Jane Doe" },
  get_or_create: true, // idempotent — returns existing if data matches
});

// Download .pkpass binary
const binary = await pf.passes.download(passId);

// Update pass data
const { pass, push_sent } = await pf.passes.update(passId, {
  data: { points: "2000" },
});

// Void a pass
const { pass: voided } = await pf.passes.void(passId);
```

### Templates

```typescript
const template = await pf.templates.create({
  name: "Loyalty Card",
  pass_style: "storeCard",
  structure: { /* pass.json structure */ },
  field_schema: { /* validation schema */ },
});

await pf.templates.publish(template.id);

const templates = await pf.templates.list();
```

### Images

```typescript
const form = new FormData();
form.append("file", fileBlob, "icon.png");
form.append("image_type", "icon");
const image = await pf.images.upload(form);

const images = await pf.images.list();
await pf.images.delete(image.id);
```

### Certificates

```typescript
const form = new FormData();
form.append("file", certBlob, "signer.pem");
form.append("cert_type", "signer_cert");
const cert = await pf.certificates.upload(form);
```

### Organization & Apps

```typescript
const org = await pf.organization.get();
await pf.organization.update({ name: "New Name" });

const apps = await pf.organization.listApps();
const app = await pf.organization.createApp({
  name: "My App",
  apple_team_id: "TEAMID",
  pass_type_identifier: "pass.com.example",
});

// Regenerate webhook secret
const updated = await pf.organization.updateApp(app.id, {
  regenerate_webhook_secret: true,
});
console.log(updated.webhook_secret_raw); // shown once

// Test validation webhook
await pf.organization.testWebhook();
```

### API Keys

```typescript
const { raw_key, ...key } = await pf.apiKeys.create({
  name: "Backend Key",
  key_type: "secret",
});
console.log(raw_key); // shown once

const keys = await pf.apiKeys.list();
await pf.apiKeys.revoke(key.id);
```

### Members

```typescript
const { members, invitations } = await pf.members.list();

await pf.members.invite({
  email: "dev@example.com",
  role: "editor",
});

await pf.members.changeRole(userId, { role: "admin" });
await pf.members.remove(userId);
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
