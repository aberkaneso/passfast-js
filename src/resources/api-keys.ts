import type { HttpClient } from "../http-client.js";
import type { ApiKey, ApiKeyCreated, CreateApiKeyRequest, RevokeKeyResponse, DeleteKeyResponse } from "../types.js";

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

  /** Revoke (deactivate) an API key. The key is soft-deleted and can no longer be used. */
  async revoke(keyId: string): Promise<RevokeKeyResponse> {
    return this.http.request<RevokeKeyResponse>({
      method: "PATCH",
      path: `/manage-keys/${encodeURIComponent(keyId)}`,
    });
  }

  /** Permanently delete an API key. */
  async delete(keyId: string): Promise<DeleteKeyResponse> {
    return this.http.request<DeleteKeyResponse>({
      method: "DELETE",
      path: `/manage-keys/${encodeURIComponent(keyId)}`,
    });
  }
}
