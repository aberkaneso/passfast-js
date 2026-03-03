import type { HttpClient } from "../http-client.js";
import type {
  Member,
  Invitation,
  InviteMemberRequest,
  ChangeRoleRequest,
} from "../types.js";

export class Members {
  constructor(private http: HttpClient) {}

  /** List all organization members. */
  async list(): Promise<{ members: Member[]; invitations: Invitation[] }> {
    return this.http.request({
      method: "GET",
      path: "/manage-members",
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

  /** Change a member's role. */
  async changeRole(userId: string, params: ChangeRoleRequest): Promise<Member> {
    return this.http.request<Member>({
      method: "PATCH",
      path: `/manage-members/${userId}/role`,
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
