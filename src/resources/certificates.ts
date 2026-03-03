import type { HttpClient } from "../http-client.js";
import type { Certificate } from "../types.js";

export class Certificates {
  constructor(private http: HttpClient) {}

  /** Upload a certificate. Pass a FormData with `file` and `cert_type` fields. */
  async upload(formData: FormData): Promise<Certificate> {
    return this.http.request<Certificate>({
      method: "POST",
      path: "/manage-certs",
      body: formData,
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
  async delete(certId: string): Promise<void> {
    await this.http.request<void>({
      method: "DELETE",
      path: `/manage-certs/${certId}`,
    });
  }
}
