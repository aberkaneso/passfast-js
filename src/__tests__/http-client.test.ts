import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { HttpClient } from "../http-client.js";
import {
  PassFastError,
  AuthenticationError,
  ValidationError,
} from "../errors.js";

function mockFetch(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
  const status = init?.status ?? 200;
  const responseHeaders = new Headers(init?.headers);
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    headers: responseHeaders,
    text: () => Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
    json: () => Promise.resolve(typeof body === "string" ? JSON.parse(body) : body),
    arrayBuffer: () => {
      const bytes = typeof body === "string" ? new TextEncoder().encode(body) : new Uint8Array();
      return Promise.resolve(bytes.buffer);
    },
  });
}

describe("HttpClient", () => {
  const baseUrl = "https://api.example.com";
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient({ baseUrl, apiKey: "sk-test-123" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("URL construction", () => {
    it("builds URL from base + path", async () => {
      globalThis.fetch = mockFetch({ ok: true });
      await client.request({ method: "GET", path: "/foo" });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${baseUrl}/foo`,
        expect.any(Object),
      );
    });

    it("strips trailing slash from base URL", async () => {
      const c = new HttpClient({ baseUrl: "https://api.example.com/", apiKey: "k" });
      globalThis.fetch = mockFetch({});
      await c.request({ method: "GET", path: "/bar" });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://api.example.com/bar",
        expect.any(Object),
      );
    });

    it("appends query params, filtering undefined", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({
        method: "GET",
        path: "/items",
        query: { status: "active", limit: 10, offset: undefined },
      });
      const url = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
      expect(url).toContain("status=active");
      expect(url).toContain("limit=10");
      expect(url).not.toContain("offset");
    });
  });

  describe("Headers", () => {
    it("sends Authorization Bearer header", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers.Authorization).toBe("Bearer sk-test-123");
    });

    it("sends Content-Type: application/json when body is present", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "POST", path: "/x", body: { a: 1 } });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers["Content-Type"]).toBe("application/json");
    });

    it("does not send Content-Type without body", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers["Content-Type"]).toBeUndefined();
    });

    it("sends X-Org-Id when configured", async () => {
      const c = new HttpClient({ baseUrl, apiKey: "k", orgId: "org-1" });
      globalThis.fetch = mockFetch({});
      await c.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers["X-Org-Id"]).toBe("org-1");
    });

    it("sends X-App-Id when configured", async () => {
      const c = new HttpClient({ baseUrl, apiKey: "k", appId: "app-1" });
      globalThis.fetch = mockFetch({});
      await c.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers["X-App-Id"]).toBe("app-1");
    });

    it("does not send X-Org-Id or X-App-Id when not configured", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.headers["X-Org-Id"]).toBeUndefined();
      expect(opts.headers["X-App-Id"]).toBeUndefined();
    });
  });

  describe("Body serialization", () => {
    it("JSON-stringifies body", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "POST", path: "/x", body: { key: "val" } });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.body).toBe('{"key":"val"}');
    });

    it("sends undefined body when none provided", async () => {
      globalThis.fetch = mockFetch({});
      await client.request({ method: "GET", path: "/x" });
      const opts = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1];
      expect(opts.body).toBeUndefined();
    });
  });

  describe("Response parsing", () => {
    it("parses JSON response", async () => {
      globalThis.fetch = mockFetch({ id: "1", name: "test" });
      const result = await client.request<{ id: string; name: string }>({
        method: "GET",
        path: "/x",
      });
      expect(result).toEqual({ id: "1", name: "test" });
    });

    it("returns undefined for empty response", async () => {
      globalThis.fetch = mockFetch("");
      const result = await client.request({ method: "DELETE", path: "/x" });
      expect(result).toBeUndefined();
    });

    it("rawResponse returns status, headers, and Uint8Array body", async () => {
      const responseHeaders = { "X-Pass-Id": "p-1" };
      globalThis.fetch = mockFetch("binary-data", { status: 200, headers: responseHeaders });
      const result = await client.request({
        method: "GET",
        path: "/download",
        rawResponse: true,
      });
      expect(result.status).toBe(200);
      expect(result.headers.get("X-Pass-Id")).toBe("p-1");
      expect(result.body).toBeInstanceOf(Uint8Array);
    });
  });

  describe("Error handling", () => {
    it("throws correct error class for error response", async () => {
      globalThis.fetch = mockFetch(
        { error: { code: "unauthorized", message: "Invalid API key" } },
        { status: 401 },
      );
      await expect(
        client.request({ method: "GET", path: "/x" }),
      ).rejects.toThrow(AuthenticationError);
    });

    it("throws ValidationError for 400", async () => {
      globalThis.fetch = mockFetch(
        { error: { code: "bad_request", message: "Bad", details: { f: "x" } } },
        { status: 400 },
      );
      await expect(
        client.request({ method: "GET", path: "/x" }),
      ).rejects.toThrow(ValidationError);
    });

    it("throws PassFastError with code 'unknown' for non-JSON error body", async () => {
      const status = 500;
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status,
        statusText: "Internal Server Error",
        headers: new Headers(),
        json: () => Promise.reject(new Error("invalid json")),
        text: () => Promise.resolve("not json"),
      });
      await expect(
        client.request({ method: "GET", path: "/x" }),
      ).rejects.toThrow(PassFastError);
    });

    it("rawResponse throws on non-ok status", async () => {
      globalThis.fetch = mockFetch(
        { error: { code: "not_found", message: "Not found" } },
        { status: 404 },
      );
      await expect(
        client.request({ method: "GET", path: "/x", rawResponse: true }),
      ).rejects.toThrow(PassFastError);
    });
  });

  describe("Timeout", () => {
    it("throws PassFastError with code 'timeout' on abort", async () => {
      const c = new HttpClient({ baseUrl, apiKey: "k", timeout: 1 });
      globalThis.fetch = vi.fn().mockImplementation(
        (_url: string, opts: { signal: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            opts.signal.addEventListener("abort", () => {
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }),
      );
      await expect(
        c.request({ method: "GET", path: "/slow" }),
      ).rejects.toThrow(PassFastError);

      try {
        await c.request({ method: "GET", path: "/slow" });
      } catch (err) {
        expect((err as PassFastError).code).toBe("timeout");
      }
    });
  });

  describe("Network errors", () => {
    it("throws PassFastError with code 'network_error' on fetch failure", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
      await expect(
        client.request({ method: "GET", path: "/x" }),
      ).rejects.toThrow(PassFastError);

      try {
        await client.request({ method: "GET", path: "/x" });
      } catch (err) {
        expect((err as PassFastError).code).toBe("network_error");
      }
    });
  });
});
