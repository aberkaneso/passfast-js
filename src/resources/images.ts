import type { HttpClient } from "../http-client.js";
import type { Image } from "../types.js";

export class Images {
  constructor(private http: HttpClient) {}

  /** Upload an image. Pass a FormData with `file` and `image_type` fields. */
  async upload(formData: FormData): Promise<Image> {
    return this.http.request<Image>({
      method: "POST",
      path: "/manage-images",
      body: formData,
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
  async delete(imageId: string): Promise<void> {
    await this.http.request<void>({
      method: "DELETE",
      path: `/manage-images/${imageId}`,
    });
  }
}
