import { describe, it, expect, vi, beforeEach } from "vitest";
import type { HttpClient, RequestOptions } from "../http-client.js";
import { Members } from "../resources/members.js";

function createMockHttp() {
  return {
    request: vi.fn().mockResolvedValue({}),
  } as unknown as HttpClient & { request: ReturnType<typeof vi.fn> };
}

describe("Members", () => {
  let http: ReturnType<typeof createMockHttp>;

  beforeEach(() => {
    http = createMockHttp();
  });

  describe("X-Org-Id header", () => {
    it("sends X-Org-Id on all requests when orgId is provided", async () => {
      const members = new Members(http, "org-123");

      await members.list();
      await members.listInvitations();
      await members.invite({ email: "a@b.com", role: "admin" });
      await members.acceptInvitation({ token: "tok" });
      await members.revokeInvitation("inv-1");
      await members.changeRole("u-1", { role: "admin" });
      await members.remove("u-2");

      for (const call of http.request.mock.calls) {
        const opts = call[0] as RequestOptions;
        expect(opts.headers).toEqual(expect.objectContaining({ "X-Org-Id": "org-123" }));
      }
    });

    it("does not send X-Org-Id when orgId is not provided", async () => {
      const members = new Members(http);

      await members.list();
      await members.invite({ email: "a@b.com", role: "admin" });

      for (const call of http.request.mock.calls) {
        const opts = call[0] as RequestOptions;
        expect(opts.headers).toBeUndefined();
      }
    });
  });

  describe("request paths", () => {
    it("list calls GET /manage-members", async () => {
      const members = new Members(http);
      await members.list();
      expect(http.request).toHaveBeenCalledWith(
        expect.objectContaining({ method: "GET", path: "/manage-members" }),
      );
    });

    it("listInvitations calls GET /manage-members/invitations", async () => {
      const members = new Members(http);
      await members.listInvitations();
      expect(http.request).toHaveBeenCalledWith(
        expect.objectContaining({ method: "GET", path: "/manage-members/invitations" }),
      );
    });

    it("invite calls POST /manage-members/invite", async () => {
      const members = new Members(http);
      await members.invite({ email: "a@b.com", role: "admin" });
      expect(http.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          path: "/manage-members/invite",
          body: { email: "a@b.com", role: "admin" },
        }),
      );
    });

    it("remove calls DELETE /manage-members/:userId", async () => {
      const members = new Members(http);
      await members.remove("u-1");
      expect(http.request).toHaveBeenCalledWith(
        expect.objectContaining({ method: "DELETE", path: "/manage-members/u-1" }),
      );
    });

    it("encodes userId in path", async () => {
      const members = new Members(http);
      await members.remove("user/with spaces");
      expect(http.request).toHaveBeenCalledWith(
        expect.objectContaining({ path: "/manage-members/user%2Fwith%20spaces" }),
      );
    });
  });
});
