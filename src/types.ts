// ── Enums ──

export type PassStyle =
  | "coupon"
  | "eventTicket"
  | "generic"
  | "boardingPass"
  | "storeCard";

export type PassStatus = "active" | "invalidated" | "expired";

export type TemplateStatus = "draft" | "published" | "archived";

export type CertType = "signer_cert" | "signer_key" | "wwdr";

export type KeyType = "secret" | "publishable";

export type OrgRole = "owner" | "admin" | "editor" | "viewer";

export type EventType =
  | "pass.created"
  | "pass.updated"
  | "pass.voided"
  | "device.registered"
  | "device.unregistered";

export type DeliveryStatus = "pending" | "delivered" | "failed";

// ── Models ──

export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  relevantText?: string;
}

export interface Pass {
  id: string;
  serial_number: string;
  template_id: string;
  organization_id: string;
  app_id: string;
  status: PassStatus;
  dynamic_data: Record<string, unknown>;
  external_id: string | null;
  /** @remarks This is a secret — do not log. */
  authentication_token: string;
  pkpass_storage_path: string;
  pkpass_hash: string;
  expires_at: string | null;
  voided_at: string | null;
  last_updated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  organization_id: string;
  app_id: string;
  name: string;
  description: string | null;
  pass_style: PassStyle;
  structure: Record<string, unknown>;
  field_schema: Record<string, unknown> | null;
  status: TemplateStatus;
  icon_image_id: string | null;
  logo_image_id: string | null;
  strip_image_id: string | null;
  thumbnail_image_id: string | null;
  background_image_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  organization_id: string;
  app_id: string;
  purpose: string;
  filename: string;
  storage_path: string;
  preview_url: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  organization_id: string;
  app_id: string;
  cert_type: CertType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  apns_key_id: string | null;
  billing_plan: string | null;
  monthly_pass_limit: number | null;
  features: Record<string, unknown> | null;
  is_active: boolean;
  /** @remarks This is a secret — do not log. */
  webhook_secret: string | null;
  created_at: string;
  updated_at: string;
}

export interface App {
  id: string;
  organization_id: string;
  name: string;
  apple_team_id: string | null;
  pass_type_identifier: string | null;
  is_active: boolean;
  validation_webhook_url: string | null;
  webhook_url: string | null;
  /** @remarks This is a secret — do not log. */
  webhook_secret: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key_type: KeyType;
  key_prefix: string;
  scopes: string[];
  expires_at: string | null;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated extends ApiKey {
  raw_key: string;
}

export interface Member {
  id: string;
  user_id: string;
  email: string;
  role: OrgRole;
  created_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "pending" | "accepted" | "expired" | "revoked";
  expires_at: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  event_type: EventType;
  payload: Record<string, unknown>;
  delivery_status: DeliveryStatus;
  attempts: number;
  delivered_at: string | null;
  next_retry_at: string | null;
  last_error: string | null;
  created_at: string;
}

// ── Request Types ──

export interface GeneratePassRequest {
  template_id: string;
  serial_number: string;
  data: Record<string, unknown>;
  external_id?: string;
  expires_at?: string;
  get_or_create?: boolean;
  locations?: Location[];
  relevant_date?: string;
  max_distance?: number;
}

export interface ListPassesParams {
  status?: PassStatus;
  serial_number?: string;
  external_id?: string;
  template_id?: string;
  created_after?: string;
  created_before?: string;
  limit?: number;
  offset?: number;
}

export interface UpdatePassRequest {
  data?: Record<string, unknown>;
  push_update?: boolean;
  locations?: Location[];
  relevant_date?: string;
  max_distance?: number;
}

export interface CreateTemplateRequest {
  name: string;
  pass_style: PassStyle;
  structure: Record<string, unknown>;
  description?: string;
  field_schema?: Record<string, unknown>;
  icon_image_id?: string;
  logo_image_id?: string;
  strip_image_id?: string;
  thumbnail_image_id?: string;
  background_image_id?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  pass_style?: PassStyle;
  structure?: Record<string, unknown>;
  field_schema?: Record<string, unknown>;
}

export interface CreateApiKeyRequest {
  name: string;
  key_type: KeyType;
}

export interface InviteMemberRequest {
  email: string;
  role: "admin" | "editor" | "viewer";
}

export interface ChangeRoleRequest {
  role: "admin" | "editor" | "viewer";
}

export interface ChangeRoleResponse {
  id: string;
  role: "admin" | "editor" | "viewer";
}

export interface ListWebhookEventsParams {
  event_type?: EventType;
  delivery_status?: DeliveryStatus;
  limit?: number;
  offset?: number;
}

export interface CreateAppRequest {
  name?: string;
}

export interface UpdateAppRequest {
  name?: string;
  apple_team_id?: string;
  pass_type_identifier?: string;
  validation_webhook_url?: string | null;
  webhook_url?: string | null;
  regenerate_webhook_secret?: boolean;
}

export interface UpdateOrgRequest {
  name?: string;
  slug?: string;
  apns_key_id?: string;
  apns_key_p8?: string;
}

export interface UploadImageRequest {
  purpose: string;
  filename: string;
  data: string;
}

export interface UploadCertificateRequest {
  cert_type: CertType;
  cert_data: string;
}

export interface UploadP12Request {
  p12_data: string;
  password?: string;
}

export interface AcceptInvitationRequest {
  token: string;
}

// ── Response Types ──

export interface GeneratePassResponse {
  passId: string;
  pkpassData: Uint8Array;
  existed: boolean;
}

export interface UpdatePassResponse {
  id: string;
  status: PassStatus;
  devices_notified: number;
  updated_at: string;
}

export interface VoidPassResponse {
  id: string;
  serial_number: string;
  status: "invalidated";
  voided_at: string;
  updated_at: string;
}

export interface UpdateAppResponse extends App {
  /** @remarks This is a secret — do not log. */
  webhook_secret_raw?: string;
}

export interface RevokeKeyResponse {
  id: string;
  is_active: false;
  message: string;
}

export interface AcceptInvitationResponse {
  organization_id: string;
  user_id: string;
  role: OrgRole;
}

export interface RevokeInvitationResponse {
  id: string;
  status: "revoked";
}

export interface TestWebhookResponse {
  webhook_url: string;
  success: boolean;
  approved: boolean;
  reason: string;
  status_code: number;
  duration_ms: number;
}

export interface PaginatedList<T> {
  data: T[];
  total?: number;
}
