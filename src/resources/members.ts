import type { HttpClient } from "../http-client.js";
import type {
  Member,
  Invitation,
  InviteMemberRequest,
  InviteMemberResponse,
  ChangeRoleRequest,
  ChangeRoleResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  RevokeInvitationResponse,
  RemoveMemberResponse,
} from "../types.js";

export class Members {
  private orgHeaders?: Record<string, string>;

  constructor(private http: HttpClient, orgId?: string) {
    if (orgId) {
      this.orgHeaders = { "X-Org-Id": orgId };
    }
  }

  /** List all organization members. */
  async list(): Promise<Member[]> {
    return this.http.request<Member[]>({
      method: "GET",
      path: "/manage-members",
      headers: this.orgHeaders,
    });
  }

  /** List all pending invitations. */
  async listInvitations(): Promise<Invitation[]> {
    return this.http.request<Invitation[]>({
      method: "GET",
      path: "/manage-members/invitations",
      headers: this.orgHeaders,
    });
  }

  /** Invite a new member by email. */
  async invite(params: InviteMemberRequest): Promise<InviteMemberResponse> {
    return this.http.request<InviteMemberResponse>({
      method: "POST",
      path: "/manage-members/invite",
      body: params,
      headers: this.orgHeaders,
    });
  }

  /** Accept an invitation. */
  async acceptInvitation(params: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    return this.http.request<AcceptInvitationResponse>({
      method: "POST",
      path: "/manage-members/accept",
      body: params,
      headers: this.orgHeaders,
    });
  }

  /** Revoke a pending invitation. */
  async revokeInvitation(invitationId: string): Promise<RevokeInvitationResponse> {
    return this.http.request<RevokeInvitationResponse>({
      method: "DELETE",
      path: `/manage-members/invitations/${encodeURIComponent(invitationId)}`,
      headers: this.orgHeaders,
    });
  }

  /** Change a member's role. */
  async changeRole(userId: string, params: ChangeRoleRequest): Promise<ChangeRoleResponse> {
    return this.http.request<ChangeRoleResponse>({
      method: "PATCH",
      path: `/manage-members/${encodeURIComponent(userId)}`,
      body: params,
      headers: this.orgHeaders,
    });
  }

  /** Remove a member from the organization. */
  async remove(userId: string): Promise<RemoveMemberResponse> {
    return this.http.request<RemoveMemberResponse>({
      method: "DELETE",
      path: `/manage-members/${encodeURIComponent(userId)}`,
      headers: this.orgHeaders,
    });
  }
}
