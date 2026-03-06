import { describe, it, expect, vi, beforeEach } from "vitest";
import { Templates } from "../../resources/templates.js";

const mockHttp = { request: vi.fn() };
let templates: Templates;

beforeEach(() => {
  mockHttp.request.mockReset();
  templates = new Templates(mockHttp as any);
});

describe("Templates", () => {
  describe("create", () => {
    it("sends POST /manage-templates with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "tpl-1" });
      const params = {
        name: "VIP Pass",
        pass_style: "generic" as const,
        structure: { headerFields: [] },
      };
      await templates.create(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-templates",
        body: params,
      });
    });
  });

  describe("list", () => {
    it("sends GET /manage-templates without params", async () => {
      mockHttp.request.mockResolvedValue([]);
      await templates.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-templates",
        query: undefined,
      });
    });

    it("sends GET /manage-templates with archived query param", async () => {
      mockHttp.request.mockResolvedValue([]);
      await templates.list({ archived: true });
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-templates",
        query: { archived: true },
      });
    });
  });

  describe("get", () => {
    it("sends GET /manage-templates/{id}", async () => {
      mockHttp.request.mockResolvedValue({ id: "tpl-1" });
      await templates.get("tpl-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-templates/tpl-1",
      });
    });
  });

  describe("update", () => {
    it("sends PATCH /manage-templates/{id} with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "tpl-1" });
      const params = { name: "Updated Name" };
      await templates.update("tpl-1", params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-templates/tpl-1",
        body: params,
      });
    });
  });

  describe("delete", () => {
    it("sends DELETE /manage-templates/{id} without params", async () => {
      mockHttp.request.mockResolvedValue({ success: true });
      const result = await templates.delete("tpl-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-templates/tpl-1",
        query: undefined,
      });
      expect(result).toEqual({ success: true });
    });

    it("sends DELETE /manage-templates/{id} with permanent query param", async () => {
      mockHttp.request.mockResolvedValue({ success: true });
      await templates.delete("tpl-1", { permanent: true });
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-templates/tpl-1",
        query: { permanent: true },
      });
    });
  });

  describe("publish", () => {
    it("sends POST /manage-templates/{id}/publish", async () => {
      mockHttp.request.mockResolvedValue({ id: "tpl-1", is_published: true });
      await templates.publish("tpl-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-templates/tpl-1/publish",
      });
    });
  });
});
