import { describe, it, expect } from "vitest";
import {
  PassFastError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  WebhookError,
  ConflictError,
  ServerError,
  errorFromResponse,
} from "../errors.js";

describe("Error classes", () => {
  it("PassFastError has correct properties", () => {
    const err = new PassFastError("test", 418, "teapot", { x: 1 });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("PassFastError");
    expect(err.message).toBe("test");
    expect(err.status).toBe(418);
    expect(err.code).toBe("teapot");
    expect(err.details).toEqual({ x: 1 });
  });

  it("AuthenticationError defaults", () => {
    const err = new AuthenticationError();
    expect(err.name).toBe("AuthenticationError");
    expect(err.status).toBe(401);
    expect(err.code).toBe("unauthorized");
    expect(err.message).toBe("Unauthorized");
  });

  it("PermissionError defaults", () => {
    const err = new PermissionError();
    expect(err.name).toBe("PermissionError");
    expect(err.status).toBe(403);
    expect(err.code).toBe("forbidden");
  });

  it("NotFoundError defaults", () => {
    const err = new NotFoundError();
    expect(err.name).toBe("NotFoundError");
    expect(err.status).toBe(404);
    expect(err.code).toBe("not_found");
  });

  it("ValidationError defaults", () => {
    const err = new ValidationError();
    expect(err.name).toBe("ValidationError");
    expect(err.status).toBe(400);
    expect(err.code).toBe("bad_request");
  });

  it("ValidationError with details", () => {
    const details = { field: "email" };
    const err = new ValidationError("Invalid email", details);
    expect(err.message).toBe("Invalid email");
    expect(err.details).toEqual(details);
  });

  it("RateLimitError defaults", () => {
    const err = new RateLimitError();
    expect(err.name).toBe("RateLimitError");
    expect(err.status).toBe(429);
    expect(err.code).toBe("rate_limited");
  });

  it("WebhookError defaults", () => {
    const err = new WebhookError();
    expect(err.name).toBe("WebhookError");
    expect(err.status).toBe(502);
    expect(err.code).toBe("webhook_error");
  });

  it("ConflictError defaults", () => {
    const err = new ConflictError();
    expect(err.name).toBe("ConflictError");
    expect(err.status).toBe(409);
    expect(err.code).toBe("conflict");
  });

  it("ServerError defaults", () => {
    const err = new ServerError();
    expect(err.name).toBe("ServerError");
    expect(err.status).toBe(500);
    expect(err.code).toBe("internal_error");
  });
});

describe("errorFromResponse", () => {
  const makeBody = (code: string, message: string, details?: unknown) => ({
    error: { code, message, details },
  });

  it("400 returns ValidationError", () => {
    const err = errorFromResponse(400, makeBody("bad_request", "Invalid input", { f: "x" }));
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toBe("Invalid input");
    expect(err.details).toEqual({ f: "x" });
  });

  it("401 returns AuthenticationError", () => {
    const err = errorFromResponse(401, makeBody("unauthorized", "Bad token"));
    expect(err).toBeInstanceOf(AuthenticationError);
    expect(err.message).toBe("Bad token");
  });

  it("403 returns PermissionError", () => {
    const err = errorFromResponse(403, makeBody("forbidden", "No access"));
    expect(err).toBeInstanceOf(PermissionError);
  });

  it("404 returns NotFoundError", () => {
    const err = errorFromResponse(404, makeBody("not_found", "Gone"));
    expect(err).toBeInstanceOf(NotFoundError);
  });

  it("409 returns ConflictError", () => {
    const err = errorFromResponse(409, makeBody("conflict", "Already exists"));
    expect(err).toBeInstanceOf(ConflictError);
  });

  it("429 returns RateLimitError", () => {
    const err = errorFromResponse(429, makeBody("rate_limited", "Slow down"));
    expect(err).toBeInstanceOf(RateLimitError);
  });

  it("502 returns WebhookError", () => {
    const err = errorFromResponse(502, makeBody("webhook_error", "Webhook failed"));
    expect(err).toBeInstanceOf(WebhookError);
  });

  it("500 returns ServerError", () => {
    const err = errorFromResponse(500, makeBody("internal_error", "Oops"));
    expect(err).toBeInstanceOf(ServerError);
  });

  it("503 (>=500) returns ServerError", () => {
    const err = errorFromResponse(503, makeBody("unavailable", "Down"));
    expect(err).toBeInstanceOf(ServerError);
  });

  it("unknown status returns base PassFastError", () => {
    const err = errorFromResponse(418, makeBody("teapot", "I'm a teapot"));
    expect(err).toBeInstanceOf(PassFastError);
    expect(err).not.toBeInstanceOf(ValidationError);
    expect(err.status).toBe(418);
    expect(err.code).toBe("teapot");
  });
});
