import type { HttpClient } from "../http-client.js";
import type {
  Pass,
  GeneratePassRequest,
  GeneratePassResponse,
  GoogleGenerateResponse,
  DualGenerateResponse,
  ListPassesParams,
  UpdatePassRequest,
  UpdatePassResponse,
  VoidPassResponse,
  WalletTypeOptions,
} from "../types.js";

export class Passes {
  constructor(private http: HttpClient) {}

  /** Generate an Apple Wallet pass (.pkpass binary). */
  async generate(params: GeneratePassRequest & { wallet_type?: "apple" }): Promise<GeneratePassResponse>;
  /** Generate a Google Wallet pass (JSON with save_url). */
  async generate(params: GeneratePassRequest & { wallet_type: "google" }): Promise<GoogleGenerateResponse>;
  /** Generate both Apple and Google passes in one call. */
  async generate(params: GeneratePassRequest & { wallet_type: "both" }): Promise<DualGenerateResponse>;
  async generate(params: GeneratePassRequest): Promise<GeneratePassResponse | GoogleGenerateResponse | DualGenerateResponse> {
    const walletType = params.wallet_type;

    if (walletType === "google" || walletType === "both") {
      return this.http.request<GoogleGenerateResponse | DualGenerateResponse>({
        method: "POST",
        path: "/generate-pass",
        body: params,
      });
    }

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
  async getBySerial(serialNumber: string, options?: WalletTypeOptions): Promise<Pass> {
    return this.http.request<Pass>({
      method: "GET",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}`,
      query: options as Record<string, string | undefined>,
    });
  }

  /** Update a pass by serial number. */
  async updateBySerial(serialNumber: string, params: UpdatePassRequest, options?: WalletTypeOptions): Promise<UpdatePassResponse> {
    return this.http.request<UpdatePassResponse>({
      method: "PATCH",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}`,
      body: params,
      query: options as Record<string, string | undefined>,
    });
  }

  /** Void (invalidate) a pass by serial number. Triggers push notification to registered devices. */
  async voidBySerial(serialNumber: string, options?: WalletTypeOptions): Promise<VoidPassResponse> {
    return this.http.request<VoidPassResponse>({
      method: "POST",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}/void`,
      query: options as Record<string, string | undefined>,
    });
  }

  /** Download the .pkpass binary for a pass by serial number. */
  async downloadBySerial(serialNumber: string, options?: WalletTypeOptions): Promise<Uint8Array> {
    const res = await this.http.request({
      method: "GET",
      path: `/manage-passes/serial/${encodeURIComponent(serialNumber)}/download`,
      rawResponse: true,
      query: options as Record<string, string | undefined>,
    });
    return res.body;
  }
}
