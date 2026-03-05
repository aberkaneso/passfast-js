import type { HttpClient } from "../http-client.js";
import type { Certificate, UploadCertificateRequest, UploadP12Request, UploadP12Response, DeleteCertificateResponse } from "../types.js";

export class Certificates {
  constructor(private http: HttpClient) {}

  /** Upload a certificate as base64-encoded JSON. */
  async upload(params: UploadCertificateRequest): Promise<Certificate> {
    return this.http.request<Certificate>({
      method: "POST",
      path: "/manage-certs",
      body: params,
    });
  }

  /** Upload a P12 certificate bundle. Returns extracted certificates. */
  async uploadP12(params: UploadP12Request): Promise<UploadP12Response> {
    return this.http.request<UploadP12Response>({
      method: "POST",
      path: "/manage-certs/p12",
      body: params,
    });
  }

  /** List all certificates. */
  async list(): Promise<Certificate[]> {
    return this.http.request<Certificate[]>({
      method: "GET",
      path: "/manage-certs",
    });
  }

  /** Delete a certificate by ID. */
  async delete(certId: string): Promise<DeleteCertificateResponse> {
    return this.http.request<DeleteCertificateResponse>({
      method: "DELETE",
      path: `/manage-certs/${encodeURIComponent(certId)}`,
    });
  }
}
