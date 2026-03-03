import { describe, it, expect, vi, beforeEach } from "vitest";
import { Members } from "../../resources/members.js";

const mockHttp = { request: vi.fn() };
let members: Members;

beforeEach(() => {
  mockHttp.request.mockReset();
  members = new Members(mockHttp as any);
});

describe("Members", () => {
  describe("list", () => {
    it("sends GET /manage-members", async () => {
      mockHttp.request.mockResolvedValue([]);
      await members.list();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-members",
      });
    });
  });

  describe("listInvitations", () => {
    it("sends GET /manage-members/invitations", async () => {
      mockHttp.request.mockResolvedValue([]);
      await members.listInvitations();
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "GET",
        path: "/manage-members/invitations",
      });
    });
  });

  describe("invite", () => {
    it("sends POST /manage-members/invite with body", async () => {
      mockHttp.request.mockResolvedValue({ id: "inv-1" });
      const params = { email: "user@example.com", role: "editor" as const };
      await members.invite(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-members/invite",
        body: params,
      });
    });
  });

  describe("acceptInvitation", () => {
    it("sends POST /manage-members/accept with body", async () => {
      mockHttp.request.mockResolvedValue({ organization_id: "org-1" });
      const params = { token: "tok-abc" };
      await members.acceptInvitation(params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "POST",
        path: "/manage-members/accept",
        body: params,
      });
    });
  });

  describe("revokeInvitation", () => {
    it("sends DELETE /manage-members/invitations/{id}", async () => {
      mockHttp.request.mockResolvedValue({ id: "inv-1", status: "revoked" });
      await members.revokeInvitation("inv-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-members/invitations/inv-1",
      });
    });
  });

  describe("changeRole", () => {
    it("sends PATCH /manage-members/{id} with body", async () => {
      mockHttp.request.mockResolvedValue({ user_id: "u-1", role: "admin" });
      const params = { role: "admin" as const };
      await members.changeRole("u-1", params);
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "PATCH",
        path: "/manage-members/u-1",
        body: params,
      });
    });
  });

  describe("remove", () => {
    it("sends DELETE /manage-members/{id}", async () => {
      mockHttp.request.mockResolvedValue(undefined);
      await members.remove("u-1");
      expect(mockHttp.request).toHaveBeenCalledWith({
        method: "DELETE",
        path: "/manage-members/u-1",
      });
    });
  });
});
