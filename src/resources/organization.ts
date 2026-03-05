import type { HttpClient } from "../http-client.js";
import type {
  Organization,
  App,
  UpdateOrgRequest,
  CreateAppRequest,
  UpdateAppRequest,
  UpdateAppResponse,
  DeleteAppResponse,
  TestWebhookResponse,
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

  /** Get the current app (identified by X-App-Id header). */
  async getApp(): Promise<App> {
    return this.http.request<App>({
      method: "GET",
      path: "/manage-org/app",
    });
  }

  /** Create a new app. */
  async createApp(params?: CreateAppRequest): Promise<App> {
    return this.http.request<App>({
      method: "POST",
      path: "/manage-org/app",
      body: params,
    });
  }

  /** Update the current app. Returns webhook_secret_raw if regenerate_webhook_secret is true. */
  async updateApp(params: UpdateAppRequest): Promise<UpdateAppResponse> {
    return this.http.request<UpdateAppResponse>({
      method: "PATCH",
      path: "/manage-org/app",
      body: params,
    });
  }

  /** Delete the current app. */
  async deleteApp(): Promise<DeleteAppResponse> {
    return this.http.request<DeleteAppResponse>({
      method: "DELETE",
      path: "/manage-org/app",
    });
  }

  /** Test the configured webhook. */
  async testWebhook(): Promise<TestWebhookResponse> {
    return this.http.request<TestWebhookResponse>({
      method: "POST",
      path: "/manage-org/app/test-webhook",
    });
  }
}
