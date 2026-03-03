import type { HttpClient } from "../http-client.js";
import type {
  Pass,
  GeneratePassRequest,
  GeneratePassResponse,
  ListPassesParams,
  UpdatePassRequest,
  UpdatePassResponse,
  VoidPassResponse,
} from "../types.js";

export class Passes {
  constructor(private http: HttpClient) {}

  /** Generate a .pkpass binary. Returns passId, raw pkpass bytes, and whether it already existed. */
  async generate(params: GeneratePassRequest): Promise<GeneratePassResponse> {
    const res = await this.http.request({
      method: "POST",
      path: "/generate-pass",
      body: params,
      rawResponse: true,
    });

    return {
      passId: res.headers.get("X-Pass-Id")!,
      pkpassData: res.body,
      existed: res.headers.get("X-Pass-Existed") === "true",
    };
  }

  /** List passes with optional filters. */
  async list(params?: ListPassesParams): Promise<Pass[]> {
    return this.http.request<Pass[]>({
      method: "GET",
      path: "/manage-passes",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Get a single pass by ID. */
  async get(passId: string): Promise<Pass> {
    return this.http.request<Pass>({
      method: "GET",
      path: `/manage-passes/${passId}`,
    });
  }

  /** Download the .pkpass binary for a pass. */
  async download(passId: string): Promise<Uint8Array> {
    const res = await this.http.request({
      method: "GET",
      path: `/manage-passes/${passId}/download`,
      rawResponse: true,
    });
    return res.body;
  }

  /** Update a pass (data, expires_at). Triggers push notification to registered devices. */
  async update(passId: string, params: UpdatePassRequest): Promise<UpdatePassResponse> {
    return this.http.request<UpdatePassResponse>({
      method: "PATCH",
      path: `/manage-passes/${passId}`,
      body: params,
    });
  }

  /** Void a pass. Triggers push notification to registered devices. */
  async void(passId: string): Promise<VoidPassResponse> {
    return this.http.request<VoidPassResponse>({
      method: "DELETE",
      path: `/manage-passes/${passId}`,
    });
  }
}
