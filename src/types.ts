// ── Enums ──

export type PassStyle =
  | "coupon"
  | "eventTicket"
  | "generic"
  | "boardingPass"
  | "storeCard";

export type PassStatus = "active" | "voided" | "expired";

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

export interface Pass {
  id: string;
  serial_number: string;
  template_id: string;
  organization_id: string;
  app_id: string;
  status: PassStatus;
  dynamic_data: Record<string, unknown>;
  external_id: string | null;
  authentication_token: string;
  pkpass_storage_path: string;
  pkpass_hash: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  organization_id: string;
  app_id: string;
  name: string;
  pass_style: PassStyle;
  structure: Record<string, unknown>;
  field_schema: Record<string, unknown> | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  organization_id: string;
  app_id: string;
  image_type: string;
  filename: string;
  storage_path: string;
  content_type: string;
  size: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  organization_id: string;
  app_id: string;
  cert_type: CertType;
  filename: string;
  subject: string | null;
  issuer: string | null;
  valid_from: string | null;
  valid_to: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface App {
  id: string;
  organization_id: string;
  name: string;
  apple_team_id: string | null;
  pass_type_identifier: string | null;
  validation_webhook_url: string | null;
  event_webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_type: KeyType;
  prefix: string;
  scopes: string[];
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyCreated extends ApiKey {
  raw_key: string;
}

export interface Member {
  user_id: string;
  email: string;
  role: OrgRole;
  joined_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: OrgRole;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  organization_id: string;
  app_id: string;
  event_type: EventType;
  payload: Record<string, unknown>;
  delivery_status: DeliveryStatus;
  attempts: number;
  last_attempt_at: string | null;
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
}

export interface ListPassesParams {
  status?: PassStatus;
  serial_number?: string;
  external_id?: string;
  template_id?: string;
  limit?: number;
  offset?: number;
}

export interface UpdatePassRequest {
  data?: Record<string, unknown>;
  expires_at?: string | null;
}

export interface CreateTemplateRequest {
  name: string;
  pass_style: PassStyle;
  structure: Record<string, unknown>;
  field_schema?: Record<string, unknown>;
}

export interface UpdateTemplateRequest {
  name?: string;
  structure?: Record<string, unknown>;
  field_schema?: Record<string, unknown>;
}

export interface CreateApiKeyRequest {
  name: string;
  key_type: KeyType;
  scopes?: string[];
}

export interface InviteMemberRequest {
  email: string;
  role: OrgRole;
}

export interface ChangeRoleRequest {
  role: OrgRole;
}

export interface ListWebhookEventsParams {
  event_type?: EventType;
  delivery_status?: DeliveryStatus;
  limit?: number;
  offset?: number;
}

export interface CreateAppRequest {
  name: string;
  apple_team_id?: string;
  pass_type_identifier?: string;
}

export interface UpdateAppRequest {
  name?: string;
  apple_team_id?: string;
  pass_type_identifier?: string;
  validation_webhook_url?: string | null;
  event_webhook_url?: string | null;
  regenerate_webhook_secret?: boolean;
}

export interface UpdateOrgRequest {
  name?: string;
}

// ── Response Types ──

export interface GeneratePassResponse {
  passId: string;
  pkpassData: Uint8Array;
  existed: boolean;
}

export interface UpdatePassResponse {
  pass: Pass;
  push_sent: boolean;
}

export interface VoidPassResponse {
  pass: Pass;
  push_sent: boolean;
}

export interface UpdateAppResponse extends App {
  webhook_secret_raw?: string;
}

export interface PaginatedList<T> {
  data: T[];
  total?: number;
}
