import { describe, it, expect, vi, beforeEach } from "vitest";
import { Passes } from "../../resources/passes.js";

const mockHttp = { request: vi.fn() };
let passes: Passes;

beforeEach(() => {
  mockHttp.request.mockReset();
  passes = new Passes(mockHttp as any);
});

describe("Passes", () => {
  describe("generate", () => {
    it("sends POST /generate-pass with rawResponse", async () => {
      const headers = new Headers({
        "X-Pass-Id": "pass-1",
        "X-Pass-Existed": "false",
      });
      mockHttp.request.mockResolvedValue({
        status: 200,
        headers,
        body: new Uint8Array([1, 2, 3]),
      });

      const params = {
        template_id: "tpl-1",
        serial_number: "SN-001",
        data: { name: "John" },
      };
      const result = await passes.generate(params);

      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/generate-pass",
        body: params,
        rawResponse: true,
      });
      expect(result.passId).toBe("pass-1");
      expect(result.pkpassData).toBeInstanceOf(Uint8Array);
      expect(result.existed).toBe(false);
    });

    it("sends generate with locations, relevant_date, and max_distance", async () => {
      const headers = new Headers({
        "X-Pass-Id": "pass-3",
        "X-Pass-Existed": "false",
      });
      mockHttp.request.mockResolvedValue({
        status: 200,
        headers,
        body: new Uint8Array([4, 5, 6]),
      });

      const params = {
        template_id: "tpl-1",
        serial_number: "SN-003",
        data: { name: "Jane" },
        locations: [
          { latitude: 40.7128, longitude: -74.006 },
          { latitude: 34.0522, longitude: -118.2437, altitude: 71, relevantText: "LA Office" },
        ],
        relevant_date: "2026-12-25T00:00:00Z",
        max_distance: 1000,
      };
      const result = await passes.generate(params);

      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/generate-pass",
        body: params,
        rawResponse: true,
      });
      expect(result.passId).toBe("pass-3");
    });

    it("sets existed=true when header says so", async () => {
      const headers = new Headers({
        "X-Pass-Id": "pass-2",
        "X-Pass-Existed": "true",
      });
      mockHttp.request.mockResolvedValue({
        status: 200,
        headers,
        body: new Uint8Array(),
      });

      const result = await passes.generate({
        template_id: "tpl-1",
        serial_number: "SN-002",
        data: {},
      });
      expect(result.existed).toBe(true);
    });
  });

  describe("list", () => {
    it("sends GET /manage-passes without params", async () => {
      mockHttp.request.mockResolvedValue([]);
      await passes.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes",
        query: undefined,
      });
    });

    it("sends GET /manage-passes with query params", async () => {
      mockHttp.request.mockResolvedValue([]);
      const params = { status: "active" as const, limit: 10 };
      await passes.list(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes",
        query: params,
      });
    });
  });

  describe("get", () => {
    it("sends GET /manage-passes/{id}", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1" });
      await passes.get("pass-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes/pass-1",
      });
    });
  });

  describe("download", () => {
    it("sends GET /manage-passes/{id}/download with rawResponse", async () => {
      const body = new Uint8Array([1, 2, 3]);
      mockHttp.request.mockResolvedValue({ status: 200, headers: new Headers(), body });
      const result = await passes.download("pass-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes/pass-1/download",
        rawResponse: true,
      });
      expect(result).toBe(body);
    });
  });

  describe("update", () => {
    it("sends PATCH /manage-passes/{id} with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1", status: "active" });
      const params = { data: { name: "Updated" }, push_update: true };
      await passes.update("pass-1", params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-passes/pass-1",
        body: params,
      });
    });

    it("sends PATCH with locations, relevant_date, and max_distance", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1", status: "active" });
      const params = {
        locations: [{ latitude: 37.33, longitude: -122.03, relevantText: "Near HQ" }],
        relevant_date: "2026-06-15T09:00:00Z",
        max_distance: 500,
      };
      await passes.update("pass-1", params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-passes/pass-1",
        body: params,
      });
    });
  });

  describe("void", () => {
    it("sends POST /manage-passes/{id}/void", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1", status: "invalidated" });
      await passes.void("pass-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-passes/pass-1/void",
      });
    });
  });

  describe("getBySerial", () => {
    it("sends GET /manage-passes/serial/{serial_number}", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1", serial_number: "SN-001" });
      await passes.getBySerial("SN-001");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes/serial/SN-001",
      });
    });
  });

  describe("updateBySerial", () => {
    it("sends PATCH /manage-passes/serial/{serial_number} with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "pass-1", status: "active" });
      const params = { data: { name: "Updated" }, push_update: true };
      await passes.updateBySerial("SN-001", params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-passes/serial/SN-001",
        body: params,
      });
    });
  });

  describe("voidBySerial", () => {
    it("sends POST /manage-passes/serial/{serial_number}/void", async () => {
      mockHttp.request.mockResolvedValue({
        id: "pass-1",
        serial_number: "SN-001",
        status: "invalidated",
        voided_at: "2026-03-06T00:00:00Z",
        updated_at: "2026-03-06T00:00:00Z",
        pkpass_rebuilt: true,
        devices_notified: 1,
      });
      const result = await passes.voidBySerial("SN-001");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-passes/serial/SN-001/void",
      });
      expect(result.status).toBe("invalidated");
    });
  });

  describe("downloadBySerial", () => {
    it("sends GET /manage-passes/serial/{serial_number}/download with rawResponse", async () => {
      const body = new Uint8Array([1, 2, 3]);
      mockHttp.request.mockResolvedValue({ status: 200, headers: new Headers(), body });
      const result = await passes.downloadBySerial("SN-001");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-passes/serial/SN-001/download",
        rawResponse: true,
      });
      expect(result).toBe(body);
    });
  });
});
