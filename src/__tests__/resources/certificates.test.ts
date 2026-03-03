import { describe, it, expect, vi, beforeEach } from "vitest";
import { Certificates } from "../../resources/certificates.js";

const mockHttp = { request: vi.fn() };
let certs: Certificates;

beforeEach(() => {
  mockHttp.request.mockReset();
  certs = new Certificates(mockHttp as any);
});

describe("Certificates", () => {
  describe("upload", () => {
    it("sends POST /manage-certs with JSON body", async () => {
      mockHttp.request.mockResolvedValue({ id: "cert-1" });
      const params = { cert_type: "signer_cert" as const, cert_data: "base64..." };
      await certs.upload(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-certs",
        body: params,
      });
    });
  });

  describe("uploadP12", () => {
    it("sends POST /manage-certs/p12 with JSON body", async () => {
      mockHttp.request.mockResolvedValue([{ id: "cert-1" }, { id: "cert-2" }]);
      const params = { p12_data: "base64...", password: "secret" };
      await certs.uploadP12(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-certs/p12",
        body: params,
      });
    });
  });

  describe("list", () => {
    it("sends GET /manage-certs", async () => {
      mockHttp.request.mockResolvedValue([]);
      await certs.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-certs",
      });
    });
  });

  describe("delete", () => {
    it("sends DELETE /manage-certs/{id}", async () => {
      mockHttp.request.mockResolvedValue(undefined);
      await certs.delete("cert-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-certs/cert-1",
      });
    });
  });
});
