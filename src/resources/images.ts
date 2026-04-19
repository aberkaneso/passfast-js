import type { HttpClient } from "../http-client.js";
import type {
  Image,
  UploadImageRequest,
  UploadImageResponse,
  DeleteImageResponse,
} from "../types.js";

export class Images {
  constructor(private http: HttpClient) {}

  /** Upload a PNG image as multipart form data. */
  async upload(params: UploadImageRequest): Promise<UploadImageResponse> {
    const form = new FormData();
    form.append("purpose", params.purpose);

    const blob =
      params.file instanceof Uint8Array
        ? new Blob([params.file as BlobPart], { type: "image/png" })
        : params.file;
    form.append("file", blob, params.filename ?? "image.png");

    return this.http.request<UploadImageResponse>({
      method: "POST",
      path: "/manage-images",
      body: form,
    });
  }

  /** List all images for the current app. */
  async list(): Promise<Image[]> {
    return this.http.request<Image[]>({
      method: "GET",
      path: "/manage-images",
    });
  }

  /** Delete an image. Fails if the image is referenced by a template. */
  async delete(imageId: string): Promise<DeleteImageResponse> {
    return this.http.request<DeleteImageResponse>({
      method: "DELETE",
      path: `/manage-images/${encodeURIComponent(imageId)}`,
    });
  }
}
