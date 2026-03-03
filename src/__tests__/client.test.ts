import { describe, it, expect } from "vitest";
import { PassFast } from "../client.js";
import { Passes } from "../resources/passes.js";
import { Templates } from "../resources/templates.js";
import { Images } from "../resources/images.js";
import { Certificates } from "../resources/certificates.js";
import { OrganizationResource } from "../resources/organization.js";
import { ApiKeys } from "../resources/api-keys.js";
import { Members } from "../resources/members.js";
import { WebhookEvents } from "../resources/webhook-events.js";

describe("PassFast client", () => {
  it("initializes all resource instances", () => {
    const client = new PassFast("sk-test-123");
    expect(client.passes).toBeInstanceOf(Passes);
    expect(client.templates).toBeInstanceOf(Templates);
    expect(client.images).toBeInstanceOf(Images);
    expect(client.certificates).toBeInstanceOf(Certificates);
    expect(client.organization).toBeInstanceOf(OrganizationResource);
    expect(client.apiKeys).toBeInstanceOf(ApiKeys);
    expect(client.members).toBeInstanceOf(Members);
    expect(client.webhookEvents).toBeInstanceOf(WebhookEvents);
  });

  it("accepts options", () => {
    const client = new PassFast("sk-test-123", {
      baseUrl: "https://custom.api.com",
      orgId: "org-1",
      appId: "app-1",
      timeout: 5000,
    });
    expect(client.passes).toBeInstanceOf(Passes);
  });
});
