import type { HttpClient } from "../http-client.js";
import type {
  Member,
  Invitation,
  InviteMemberRequest,
  ChangeRoleRequest,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  RevokeInvitationResponse,
} from "../types.js";

export class Members {
  constructor(private http: HttpClient) {}

  /** List all organization members. */
  async list(): Promise<Member[]> {
    return this.http.request<Member[]>({
      method: "GET",
      path: "/manage-members",
    });
  }

  /** List all pending invitations. */
  async listInvitations(): Promise<Invitation[]> {
    return this.http.request<Invitation[]>({
      method: "GET",
      path: "/manage-members/invitations",
    });
  }

  /** Invite a new member by email. */
  async invite(params: InviteMemberRequest): Promise<Invitation> {
    return this.http.request<Invitation>({
      method: "POST",
      path: "/manage-members/invite",
      body: params,
    });
  }

  /** Accept an invitation. */
  async acceptInvitation(params: AcceptInvitationRequest): Promise<AcceptInvitationResponse> {
    return this.http.request<AcceptInvitationResponse>({
      method: "POST",
      path: "/manage-members/accept",
      body: params,
    });
  }

  /** Revoke a pending invitation. */
  async revokeInvitation(invitationId: string): Promise<RevokeInvitationResponse> {
    return this.http.request<RevokeInvitationResponse>({
      method: "DELETE",
      path: `/manage-members/invitations/${invitationId}`,
    });
  }

  /** Change a member's role. */
  async changeRole(userId: string, params: ChangeRoleRequest): Promise<Member> {
    return this.http.request<Member>({
      method: "PATCH",
      path: `/manage-members/${userId}`,
      body: params,
    });
  }

  /** Remove a member from the organization. */
  async remove(userId: string): Promise<void> {
    await this.http.request<void>({
      method: "DELETE",
      path: `/manage-members/${userId}`,
    });
  }
}
