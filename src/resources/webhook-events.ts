import type { HttpClient } from "../http-client.js";
import type { WebhookEvent, ListWebhookEventsParams } from "../types.js";

export class WebhookEvents {
  constructor(private http: HttpClient) {}

  /** List webhook events with optional filters. */
  async list(params?: ListWebhookEventsParams): Promise<WebhookEvent[]> {
    return this.http.request<WebhookEvent[]>({
      method: "GET",
      path: "/manage-org/webhook-events",
      query: params as Record<string, string | number | undefined>,
    });
  }
}
