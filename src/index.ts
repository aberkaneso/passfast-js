export { PassFast, type PassFastOptions } from "./client.js";

// Errors
export {
  PassFastError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  WebhookError,
  ConflictError,
  ServerError,
} from "./errors.js";

// Types
export type {
  // Enums
  PassStyle,
  PassStatus,
  CertType,
  KeyType,
  OrgRole,
  EventType,
  DeliveryStatus,
  // Models
  Pass,
  Template,
  Image,
  Certificate,
  Organization,
  App,
  ApiKey,
  ApiKeyCreated,
  Member,
  Invitation,
  WebhookEvent,
  // Request types
  GeneratePassRequest,
  ListPassesParams,
  UpdatePassRequest,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateApiKeyRequest,
  InviteMemberRequest,
  ChangeRoleRequest,
  ListWebhookEventsParams,
  CreateAppRequest,
  UpdateAppRequest,
  UpdateOrgRequest,
  // Response types
  GeneratePassResponse,
  UpdatePassResponse,
  VoidPassResponse,
  UpdateAppResponse,
  PaginatedList,
} from "./types.js";
