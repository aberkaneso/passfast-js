import { describe, it, expect } from "vitest";
import { PassFast } from "../client.js";
import { Passes } from "../resources/passes.js";
import { PassSharing } from "../resources/pass-sharing.js";
import { WebhookEvents } from "../resources/webhook-events.js";

describe("PassFast client", () => {
  it("initializes all resource instances", () => {
    const client = new PassFast("sk-test-123");
    expect(client.passes).toBeInstanceOf(Passes);
    expect(client.passSharing).toBeInstanceOf(PassSharing);
    expect(client.webhookEvents).toBeInstanceOf(WebhookEvents);
  });

  it("accepts options", () => {
    const client = new PassFast("sk-test-123", {
      appId: "app-1",
      timeout: 5000,
    });
    expect(client.passes).toBeInstanceOf(Passes);
  });
});
