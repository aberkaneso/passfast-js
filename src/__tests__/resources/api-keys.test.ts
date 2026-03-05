import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiKeys } from "../../resources/api-keys.js";

const mockHttp = { request: vi.fn() };
let apiKeys: ApiKeys;

beforeEach(() => {
  mockHttp.request.mockReset();
  apiKeys = new ApiKeys(mockHttp as any);
});

describe("ApiKeys", () => {
  describe("list", () => {
    it("sends GET /manage-keys", async () => {
      mockHttp.request.mockResolvedValue([]);
      await apiKeys.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-keys",
      });
    });
  });

  describe("create", () => {
    it("sends POST /manage-keys with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "key-1", raw_key: "sk-xxx" });
      const params = { name: "My Key", key_type: "secret" as const };
      await apiKeys.create(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-keys",
        body: params,
      });
    });
  });

  describe("revoke", () => {
    it("sends PATCH /manage-keys/{id}", async () => {
      mockHttp.request.mockResolvedValue({ id: "key-1", is_active: false });
      await apiKeys.revoke("key-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-keys/key-1",
      });
    });
  });

  describe("delete", () => {
    it("sends DELETE /manage-keys/{id}", async () => {
      mockHttp.request.mockResolvedValue({ id: "key-1", message: "deleted" });
      const result = await apiKeys.delete("key-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-keys/key-1",
      });
      expect(result).toEqual({ id: "key-1", message: "deleted" });
    });
  });
});
