export class PassFastError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "PassFastError";
  }
}

export class AuthenticationError extends PassFastError {
  constructor(message = "Unauthorized") {
    super(message, 401, "unauthorized");
    this.name = "AuthenticationError";
  }
}

export class PermissionError extends PassFastError {
  constructor(message = "Forbidden") {
    super(message, 403, "forbidden");
    this.name = "PermissionError";
  }
}

export class NotFoundError extends PassFastError {
  constructor(message = "Not found") {
    super(message, 404, "not_found");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends PassFastError {
  constructor(message = "Bad request", details?: unknown) {
    super(message, 400, "bad_request", details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends PassFastError {
  constructor(message = "Rate limited") {
    super(message, 429, "rate_limited");
    this.name = "RateLimitError";
  }
}

export class WebhookError extends PassFastError {
  constructor(message = "Webhook error") {
    super(message, 502, "webhook_error");
    this.name = "WebhookError";
  }
}

export class ConflictError extends PassFastError {
  constructor(message = "Conflict") {
    super(message, 409, "conflict");
    this.name = "ConflictError";
  }
}

export class ServerError extends PassFastError {
  constructor(message = "Internal server error") {
    super(message, 500, "internal_error");
    this.name = "ServerError";
  }
}

export function errorFromResponse(
  status: number,
  body: { error: { code: string; message: string; details?: unknown } },
): PassFastError {
  const { code, message, details } = body.error;

  switch (status) {
    case 400:
      return new ValidationError(message, details);
    case 401:
      return new AuthenticationError(message);
    case 403:
      return new PermissionError(message);
    case 404:
      return new NotFoundError(message);
    case 409:
      return new ConflictError(message);
    case 429:
      return new RateLimitError(message);
    case 502:
      return new WebhookError(message);
    default:
      if (status >= 500) return new ServerError(message);
      return new PassFastError(message, status, code, details);
  }
}
