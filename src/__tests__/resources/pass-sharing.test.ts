import { describe, it, expect, vi, beforeEach } from "vitest";
import { PassSharing } from "../../resources/pass-sharing.js";

const mockHttp = { request: vi.fn() };
let passSharing: PassSharing;

beforeEach(() => {
  mockHttp.request.mockReset();
  passSharing = new PassSharing(mockHttp as any);
});

describe("PassSharing", () => {
  describe("createShareToken", () => {
    it("sends POST /share-pass/create with pass_id", async () => {
      const response = { share_token: "abc123", share_url: "https://passfa.st/s/abc123" };
      mockHttp.request.mockResolvedValue(response);

      const result = await passSharing.createShareToken("pass-1");

      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/share-pass/create",
        body: { pass_id: "pass-1" },
      });
      expect(result).toEqual(response);
    });
  });

  describe("getMetadata", () => {
    it("sends GET /share-pass/{token}", async () => {
      const response = {
        serial_number: "SN-001",
        status: "active",
        has_apple: true,
        has_google: false,
        google_save_url: null,
        template_name: "Loyalty Card",
        pass_style: "storeCard",
        app_name: "My App",
        org_name: "My Org",
      };
      mockHttp.request.mockResolvedValue(response);

      const result = await passSharing.getMetadata("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/share-pass/abc123",
      });
      expect(result).toEqual(response);
    });
  });

  describe("download", () => {
    it("sends GET /share-pass/{token}/download with rawResponse", async () => {
      const body = new Uint8Array([1, 2, 3]);
      mockHttp.request.mockResolvedValue({ status: 200, headers: new Headers(), body });

      const result = await passSharing.download("abc123");

      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/share-pass/abc123/download",
        rawResponse: true,
      });
      expect(result).toBe(body);
    });
  });
});
