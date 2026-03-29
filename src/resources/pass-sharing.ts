import type { HttpClient } from "../http-client.js";
import type { ShareToken, SharePassMetadata } from "../types.js";

export class PassSharing {
  constructor(private http: HttpClient) {}

  /** Create a share token for public pass distribution. Idempotent — returns existing token if one exists. */
  async createShareToken(passId: string): Promise<ShareToken> {
    return this.http.request<ShareToken>({
      method: "POST",
      path: "/share-pass/create",
      body: { pass_id: passId },
    });
  }

  /** Get public metadata for a shared pass. No authentication required server-side. */
  async getMetadata(token: string): Promise<SharePassMetadata> {
    return this.http.request<SharePassMetadata>({
      method: "GET",
      path: `/share-pass/${encodeURIComponent(token)}`,
    });
  }

  /** Download the .pkpass binary for a shared pass. No authentication required server-side. */
  async download(token: string): Promise<Uint8Array> {
    const res = await this.http.request({
      method: "GET",
      path: `/share-pass/${encodeURIComponent(token)}/download`,
      rawResponse: true,
    });
    return res.body;
  }
}
