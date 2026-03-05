import type { HttpClient } from "../http-client.js";
import type { Image, UploadImageRequest, DeleteImageResponse } from "../types.js";

export class Images {
  constructor(private http: HttpClient) {}

  /** Upload an image as base64-encoded JSON. */
  async upload(params: UploadImageRequest): Promise<Image> {
    return this.http.request<Image>({
      method: "POST",
      path: "/manage-images",
      body: params,
    });
  }

  /** List all images. */
  async list(): Promise<Image[]> {
    return this.http.request<Image[]>({
      method: "GET",
      path: "/manage-images",
    });
  }

  /** Delete an image by ID. */
  async delete(imageId: string): Promise<DeleteImageResponse> {
    return this.http.request<DeleteImageResponse>({
      method: "DELETE",
      path: `/manage-images/${encodeURIComponent(imageId)}`,
    });
  }
}
