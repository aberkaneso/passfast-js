import { describe, it, expect, vi, beforeEach } from "vitest";
import { Images } from "../../resources/images.js";

const mockHttp = { request: vi.fn() };
let images: Images;

beforeEach(() => {
  mockHttp.request.mockReset();
  images = new Images(mockHttp as any);
});

describe("Images", () => {
  describe("upload", () => {
    it("sends POST /manage-images with multipart FormData", async () => {
      mockHttp.request.mockResolvedValue({
        id: "img-1",
        purpose: "icon",
        storage_path: "x/y.png",
      });

      const bytes = new Uint8Array([137, 80, 78, 71]);
      await images.upload({ purpose: "icon", file: bytes, filename: "icon.png" });

      expect(mockHttp.request).toHaveBeenCalledTimes(1);
      const call = mockHttp.request.mock.calls[0][0];
      expect(call.method).toBe("POST");
      expect(call.path).toBe("/manage-images");
      expect(call.body).toBeInstanceOf(FormData);

      const form = call.body as FormData;
      expect(form.get("purpose")).toBe("icon");
      const file = form.get("file");
      expect(file).toBeInstanceOf(Blob);
      expect((file as File).name ?? "").toBe("icon.png");
    });

    it("accepts a Blob directly and defaults the filename", async () => {
      mockHttp.request.mockResolvedValue({ id: "img-2", purpose: "logo", storage_path: "p" });
      const blob = new Blob([new Uint8Array([1, 2])], { type: "image/png" });
      await images.upload({ purpose: "logo", file: blob });

      const form = mockHttp.request.mock.calls[0][0].body as FormData;
      expect(form.get("purpose")).toBe("logo");
      const file = form.get("file") as File;
      expect(file).toBeInstanceOf(Blob);
      expect(file.name ?? "").toBe("image.png");
    });
  });

  describe("list", () => {
    it("sends GET /manage-images", async () => {
      mockHttp.request.mockResolvedValue([]);
      await images.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-images",
      });
    });
  });

  describe("delete", () => {
    it("sends DELETE /manage-images/{id}", async () => {
      mockHttp.request.mockResolvedValue({ success: true });
      await images.delete("img-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-images/img-1",
      });
    });

    it("encodes the id", async () => {
      mockHttp.request.mockResolvedValue({ success: true });
      await images.delete("img/1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-images/img%2F1",
      });
    });
  });
});
