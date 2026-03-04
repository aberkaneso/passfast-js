import { errorFromResponse, PassFastError } from "./errors.js";

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  orgId?: string;
  appId?: string;
  timeout?: number;
}

export interface RequestOptions {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  rawResponse?: boolean;
}

export interface RawResponse {
  status: number;
  headers: Headers;
  body: Uint8Array;
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private orgId?: string;
  private appId?: string;
  private timeout: number;

  constructor(config: HttpClientConfig) {
    if (!/^https:\/\//i.test(config.baseUrl)) {
      throw new Error("baseUrl must use HTTPS");
    }
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.orgId = config.orgId;
    this.appId = config.appId;
    this.timeout = config.timeout ?? 30_000;
  }

  async request<T>(options: RequestOptions & { rawResponse?: false }): Promise<T>;
  async request(options: RequestOptions & { rawResponse: true }): Promise<RawResponse>;
  async request<T>(options: RequestOptions): Promise<T | RawResponse> {
    const url = this.buildUrl(options.path, options.query);

    const headers: Record<string, string> = {
      ...options.headers,
      Authorization: `Bearer ${this.apiKey}`,
    };

    if (this.orgId) headers["X-Org-Id"] = this.orgId;
    if (this.appId) headers["X-App-Id"] = this.appId;

    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await globalThis.fetch(url, {
        method: options.method,
        headers,
        body: options.body
          ? options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body)
          : undefined,
        signal: controller.signal,
      });

      if (options.rawResponse) {
        if (!response.ok) {
          await this.handleError(response);
        }
        const body = new Uint8Array(await response.arrayBuffer());
        return { status: response.status, headers: response.headers, body };
      }

      if (!response.ok) {
        await this.handleError(response);
      }

      const text = await response.text();
      if (!text) return undefined as T;
      return JSON.parse(text) as T;
    } catch (err) {
      if (err instanceof PassFastError) throw err;
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new PassFastError("Request timed out", 0, "timeout");
      }
      throw new PassFastError(
        `Network error: ${err instanceof Error ? err.message : String(err)}`,
        0,
        "network_error",
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  private async handleError(response: Response): Promise<never> {
    let body: { error: { code: string; message: string; details?: unknown } };
    try {
      body = await response.json();
    } catch {
      throw new PassFastError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        "unknown",
      );
    }
    throw errorFromResponse(response.status, body);
  }
}
