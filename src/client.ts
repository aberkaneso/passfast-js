import { HttpClient, type HttpClientConfig } from "./http-client.js";
import { Passes } from "./resources/passes.js";
import { Templates } from "./resources/templates.js";
import { Images } from "./resources/images.js";
import { Certificates } from "./resources/certificates.js";
import { OrganizationResource } from "./resources/organization.js";
import { ApiKeys } from "./resources/api-keys.js";
import { Members } from "./resources/members.js";
import { WebhookEvents } from "./resources/webhook-events.js";

const DEFAULT_BASE_URL = "https://fbscxchawurdbieuowdi.supabase.co/functions/v1";

export interface PassFastOptions {
  /** Organization ID. Required for JWT auth, optional for API key auth. */
  orgId?: string;
  /** App ID. Required if the org has multiple apps. */
  appId?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

export class PassFast {
  readonly passes: Passes;
  readonly templates: Templates;
  readonly images: Images;
  readonly certificates: Certificates;
  readonly organization: OrganizationResource;
  readonly apiKeys: ApiKeys;
  readonly members: Members;
  readonly webhookEvents: WebhookEvents;

  constructor(apiKey: string, options?: PassFastOptions) {
    const config: HttpClientConfig = {
      baseUrl: DEFAULT_BASE_URL,
      apiKey,
      orgId: options?.orgId,
      appId: options?.appId,
      timeout: options?.timeout,
    };

    const http = new HttpClient(config);

    this.passes = new Passes(http);
    this.templates = new Templates(http);
    this.images = new Images(http);
    this.certificates = new Certificates(http);
    this.organization = new OrganizationResource(http);
    this.apiKeys = new ApiKeys(http);
    this.members = new Members(http);
    this.webhookEvents = new WebhookEvents(http);
  }
}
