import type { HttpClient } from "../http-client.js";
import type {
  Organization,
  App,
  UpdateOrgRequest,
  CreateAppRequest,
  UpdateAppRequest,
  UpdateAppResponse,
} from "../types.js";

export class OrganizationResource {
  constructor(private http: HttpClient) {}

  /** Get organization settings. */
  async get(): Promise<Organization> {
    return this.http.request<Organization>({
      method: "GET",
      path: "/manage-org",
    });
  }

  /** Update organization settings. */
  async update(params: UpdateOrgRequest): Promise<Organization> {
    return this.http.request<Organization>({
      method: "PATCH",
      path: "/manage-org",
      body: params,
    });
  }

  /** List all apps in the organization. */
  async listApps(): Promise<App[]> {
    return this.http.request<App[]>({
      method: "GET",
      path: "/manage-org/apps",
    });
  }

  /** Create a new app. */
  async createApp(params: CreateAppRequest): Promise<App> {
    return this.http.request<App>({
      method: "POST",
      path: "/manage-org/apps",
      body: params,
    });
  }

  /** Update an app. Returns webhook_secret_raw if regenerate_webhook_secret is true. */
  async updateApp(appId: string, params: UpdateAppRequest): Promise<UpdateAppResponse> {
    return this.http.request<UpdateAppResponse>({
      method: "PATCH",
      path: `/manage-org/apps/${appId}`,
      body: params,
    });
  }

  /** Delete an app. */
  async deleteApp(appId: string): Promise<void> {
    await this.http.request<void>({
      method: "DELETE",
      path: `/manage-org/apps/${appId}`,
    });
  }

  /** Test the configured validation webhook. */
  async testWebhook(): Promise<{ success: boolean; status?: number; body?: unknown }> {
    return this.http.request({
      method: "POST",
      path: "/manage-org/app/test-webhook",
    });
  }
}
