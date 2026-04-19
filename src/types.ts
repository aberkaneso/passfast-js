// ── Enums ──

export type PassStyle =
  | "coupon"
  | "eventTicket"
  | "generic"
  | "boardingPass"
  | "storeCard";

export type PassStatus = "active" | "invalidated" | "expired";

export type WalletType = "apple" | "google";

export type GenerateWalletType = "apple" | "google" | "both";

export type EventType =
  | "pass.created"
  | "pass.updated"
  | "pass.voided"
  | "device.registered"
  | "device.unregistered"
  | "pass.expired";

export type DeliveryStatus = "pending" | "delivered" | "failed";

export type GooglePassType =
  | "generic"
  | "loyalty"
  | "eventTicket"
  | "offer"
  | "flight"
  | "transit"
  | "giftCard";

export type ImagePurpose =
  | "icon"
  | "icon_2x"
  | "icon_3x"
  | "logo"
  | "logo_2x"
  | "logo_3x"
  | "thumbnail"
  | "thumbnail_2x"
  | "strip"
  | "strip_2x"
  | "background"
  | "background_2x"
  | "footer"
  | "footer_2x";

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
  wallet_type: WalletType;
  google_save_url: string | null;
  google_object_id: string | null;
}

export interface Template {
  id: string;
  organization_id: string;
  app_id: string;
  name: string;
  description: string | null;
  pass_style: PassStyle;
  google_pass_type: GooglePassType | null;
  structure: Record<string, unknown>;
  field_schema: Record<string, unknown> | null;
  is_published: boolean;
  is_archived: boolean;
  icon_image_id: string | null;
  logo_image_id: string | null;
  google_logo_image_id: string | null;
  google_wide_logo_image_id: string | null;
  strip_image_id: string | null;
  thumbnail_image_id: string | null;
  background_image_id: string | null;
  wallet_types: WalletType[];
  google_class_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  organization_id: string;
  app_id: string;
  purpose: ImagePurpose;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  preview_url: string;
  uploaded_at: string;
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
  wallet_type?: GenerateWalletType;
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
  wallet_type?: WalletType;
}

export interface UpdatePassRequest {
  data?: Record<string, unknown>;
  push_update?: boolean;
  locations?: Location[];
  relevant_date?: string;
  max_distance?: number;
  expires_at?: string | null;
}

export interface ListWebhookEventsParams {
  event_type?: EventType;
  delivery_status?: DeliveryStatus;
  limit?: number;
  offset?: number;
}

export interface WalletTypeOptions {
  wallet_type?: WalletType;
}

export interface CreateTemplateRequest {
  name: string;
  pass_style: PassStyle;
  structure: Record<string, unknown>;
  description?: string;
  google_pass_type?: GooglePassType;
  field_schema?: Record<string, unknown>;
  wallet_types?: WalletType[];
  icon_image_id?: string;
  logo_image_id?: string;
  google_logo_image_id?: string;
  google_wide_logo_image_id?: string;
  strip_image_id?: string;
  thumbnail_image_id?: string;
  background_image_id?: string;
}

export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  pass_style?: PassStyle;
  google_pass_type?: GooglePassType | null;
  structure?: Record<string, unknown>;
  field_schema?: Record<string, unknown>;
  wallet_types?: WalletType[];
  icon_image_id?: string | null;
  logo_image_id?: string | null;
  google_logo_image_id?: string | null;
  google_wide_logo_image_id?: string | null;
  strip_image_id?: string | null;
  thumbnail_image_id?: string | null;
  background_image_id?: string | null;
}

export interface ListTemplatesParams {
  archived?: boolean;
}

export interface DeleteTemplateParams {
  permanent?: boolean;
}

export interface UploadImageRequest {
  purpose: ImagePurpose;
  file: Blob | Uint8Array;
  /** Filename used in the multipart form. Defaults to "image.png". */
  filename?: string;
}

// ── Response Types ──

export interface GeneratePassResponse {
  passId: string;
  pkpassData: Uint8Array;
  existed: boolean;
  /**
   * Non-fatal warnings from Apple single-wallet generation (e.g. icon fallback,
   * truncated field group). Parsed from the `X-Pass-Warnings` response header.
   */
  warnings?: string[];
}

export interface GoogleGenerateResponse {
  id: string;
  serial_number: string;
  wallet_type: "google";
  save_url: string;
  google_object_id: string;
  status: string;
  external_id: string | null;
}

export interface DualGenerateResponse {
  apple: {
    id: string;
    serial_number: string;
    wallet_type: "apple";
    status: string;
    download_url: string;
  } | null;
  google: {
    id: string;
    serial_number: string;
    wallet_type: "google";
    status: string;
    save_url: string;
    google_object_id: string;
  } | null;
  warnings: string[];
}

export interface UpdatePassResponse {
  id: string;
  status: PassStatus;
  devices_notified: number;
  updated_at: string;
  expires_at: string | null;
  wallet_type: WalletType;
}

export interface VoidPassResponse {
  id: string;
  serial_number: string;
  status: "invalidated";
  voided_at: string;
  updated_at: string;
  pkpass_rebuilt: boolean;
  devices_notified: number;
  warning?: string;
}

export interface ShareToken {
  share_token: string;
  share_url: string;
}

export interface DeleteTemplateResponse {
  success: boolean;
}

export interface UploadImageResponse {
  id: string;
  purpose: ImagePurpose;
  storage_path: string;
}

export interface DeleteImageResponse {
  success: boolean;
}

export interface SharePassMetadata {
  serial_number: string;
  status: PassStatus;
  has_apple: boolean;
  has_google: boolean;
  google_save_url: string | null;
  template_name: string;
  pass_style: string;
  app_name: string;
  org_name: string;
}
