import type { HttpClient } from "../http-client.js";
import type {
  Image,
  ImageUsage,
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

  /**
   * Report how an image is referenced across templates and passes.
   * Useful before {@link delete} to check the blast radius (`safe_to_delete`).
   */
  async usage(imageId: string): Promise<ImageUsage> {
    return this.http.request<ImageUsage>({
      method: "GET",
      path: `/manage-images/${encodeURIComponent(imageId)}/usage`,
    });
  }

  /**
   * Delete an image. Always succeeds when the image exists — any template column
   * referencing it is silently cleared, and any per-pass `strip_image_id` override
   * pointing at it is nullified (reverts to the template's strip).
   */
  async delete(imageId: string): Promise<DeleteImageResponse> {
    return this.http.request<DeleteImageResponse>({
      method: "DELETE",
      path: `/manage-images/${encodeURIComponent(imageId)}`,
    });
  }
}
