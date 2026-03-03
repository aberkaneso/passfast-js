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
    it("sends POST /manage-images with JSON body", async () => {
      mockHttp.request.mockResolvedValue({ id: "img-1" });
      const params = { purpose: "icon", filename: "icon.png", data: "base64..." };
      await images.upload(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-images",
        body: params,
      });
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
      mockHttp.request.mockResolvedValue(undefined);
      await images.delete("img-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-images/img-1",
      });
    });
  });
});
