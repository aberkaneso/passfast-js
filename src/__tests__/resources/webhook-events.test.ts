import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebhookEvents } from "../../resources/webhook-events.js";

const mockHttp = { request: vi.fn() };
let webhookEvents: WebhookEvents;

beforeEach(() => {
  mockHttp.request.mockReset();
  webhookEvents = new WebhookEvents(mockHttp as any);
});

describe("WebhookEvents", () => {
  describe("list", () => {
    it("sends GET /manage-org/webhook-events without params", async () => {
      mockHttp.request.mockResolvedValue([]);
      await webhookEvents.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-org/webhook-events",
        query: undefined,
      });
    });

    it("sends GET /manage-org/webhook-events with query params", async () => {
      mockHttp.request.mockResolvedValue([]);
      const params = { event_type: "pass.created" as const, limit: 5 };
      await webhookEvents.list(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-org/webhook-events",
        query: params,
      });
    });
  });
});
