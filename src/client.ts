import { HttpClient, type HttpClientConfig } from "./http-client.js";
import { Passes } from "./resources/passes.js";
import { PassSharing } from "./resources/pass-sharing.js";
import { WebhookEvents } from "./resources/webhook-events.js";
import { Templates } from "./resources/templates.js";
import { Images } from "./resources/images.js";

const DEFAULT_BASE_URL = "https://api.passfa.st/functions/v1";

export interface PassFastOptions {
  /** App ID. Required if the org has multiple apps. */
  appId?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

export class PassFast {
  readonly passes: Passes;
  readonly passSharing: PassSharing;
  readonly webhookEvents: WebhookEvents;
  readonly templates: Templates;
  readonly images: Images;

  constructor(apiKey: string, options?: PassFastOptions) {
    const config: HttpClientConfig = {
      baseUrl: DEFAULT_BASE_URL,
      apiKey,
      appId: options?.appId,
      timeout: options?.timeout,
    };

    const http = new HttpClient(config);

    this.passes = new Passes(http);
    this.passSharing = new PassSharing(http);
    this.webhookEvents = new WebhookEvents(http);
    this.templates = new Templates(http);
    this.images = new Images(http);
  }
}
