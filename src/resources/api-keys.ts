import type { HttpClient } from "../http-client.js";
import type { ApiKey, ApiKeyCreated, CreateApiKeyRequest } from "../types.js";

export class ApiKeys {
  constructor(private http: HttpClient) {}

  /** List all API keys. */
  async list(): Promise<ApiKey[]> {
    return this.http.request<ApiKey[]>({
      method: "GET",
      path: "/manage-keys",
    });
  }

  /** Create a new API key. The raw key is only returned once. */
  async create(params: CreateApiKeyRequest): Promise<ApiKeyCreated> {
    return this.http.request<ApiKeyCreated>({
      method: "POST",
      path: "/manage-keys",
      body: params,
    });
  }

  /** Revoke (delete) an API key. */
  async revoke(keyId: string): Promise<void> {
    await this.http.request<void>({
      method: "DELETE",
      path: `/manage-keys/${keyId}`,
    });
  }
}
