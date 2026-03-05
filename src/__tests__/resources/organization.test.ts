import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationResource } from "../../resources/organization.js";

const mockHttp = { request: vi.fn() };
let org: OrganizationResource;

beforeEach(() => {
  mockHttp.request.mockReset();
  org = new OrganizationResource(mockHttp as any);
});

describe("OrganizationResource", () => {
  describe("get", () => {
    it("sends GET /manage-org", async () => {
      mockHttp.request.mockResolvedValue({ id: "org-1" });
      await org.get();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-org",
      });
    });
  });

  describe("update", () => {
    it("sends PATCH /manage-org with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "org-1" });
      const params = { name: "New Name" };
      await org.update(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-org",
        body: params,
      });
    });
  });

  describe("getApp", () => {
    it("sends GET /manage-org/app", async () => {
      mockHttp.request.mockResolvedValue({ id: "app-1" });
      await org.getApp();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-org/app",
      });
    });
  });

  describe("createApp", () => {
    it("sends POST /manage-org/app with optional body", async () => {
      mockHttp.request.mockResolvedValue({ id: "app-1" });
      await org.createApp({ name: "My App" });
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-org/app",
        body: { name: "My App" },
      });
    });

    it("sends POST /manage-org/app without body", async () => {
      mockHttp.request.mockResolvedValue({ id: "app-1" });
      await org.createApp();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-org/app",
        body: undefined,
      });
    });
  });

  describe("updateApp", () => {
    it("sends PATCH /manage-org/app with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "app-1" });
      const params = { name: "Updated App", webhook_url: "https://example.com/hook" };
      await org.updateApp(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-org/app",
        body: params,
      });
    });
  });

  describe("deleteApp", () => {
    it("sends DELETE /manage-org/app", async () => {
      mockHttp.request.mockResolvedValue({ id: "app-1", is_active: false, message: "deleted" });
      const result = await org.deleteApp();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-org/app",
      });
      expect(result).toEqual({ id: "app-1", is_active: false, message: "deleted" });
    });
  });

  describe("testWebhook", () => {
    it("sends POST /manage-org/app/test-webhook", async () => {
      mockHttp.request.mockResolvedValue({ success: true });
      await org.testWebhook();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-org/app/test-webhook",
      });
    });
  });
});
