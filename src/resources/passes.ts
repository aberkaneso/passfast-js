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
      path: `/manage-passes/${encodeURIComponent(passId)}`,
    });
  }

  /** Download the .pkpass binary for a pass. */
  async download(passId: string): Promise<Uint8Array> {
    const res = await this.http.request({
      method: "GET",
      path: `/manage-passes/${encodeURIComponent(passId)}/download`,
      rawResponse: true,
    });
    return res.body;
  }

  /** Update a pass. Optionally triggers push notification to registered devices. */
  async update(passId: string, params: UpdatePassRequest): Promise<UpdatePassResponse> {
    return this.http.request<UpdatePassResponse>({
      method: "PATCH",
      path: `/manage-passes/${encodeURIComponent(passId)}`,
      body: params,
    });
  }

  /** Void (invalidate) a pass. Triggers push notification to registered devices. */
  async void(passId: string): Promise<VoidPassResponse> {
    return this.http.request<VoidPassResponse>({
      method: "POST",
      path: `/manage-passes/${encodeURIComponent(passId)}/void`,
    });
  }

  /** Get a single pass by serial number. */
  async getBySerial(serialNumber: string): Promise<Pass> {
    return this.http.request<Pass>({
      method: "GET",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}`,
    });
  }

  /** Update a pass by serial number. */
  async updateBySerial(serialNumber: string, params: UpdatePassRequest): Promise<UpdatePassResponse> {
    return this.http.request<UpdatePassResponse>({
      method: "PATCH",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}`,
      body: params,
    });
  }

  /** Void (invalidate) a pass by serial number. Triggers push notification to registered devices. */
  async voidBySerial(serialNumber: string): Promise<VoidPassResponse> {
    return this.http.request<VoidPassResponse>({
      method: "POST",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}/void`,
    });
  }

  /** Download the .pkpass binary for a pass by serial number. */
  async downloadBySerial(serialNumber: string): Promise<Uint8Array> {
    const res = await this.http.request({
      method: "GET",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}/download`,
      rawResponse: true,
    });
    return res.body;
  }
}
