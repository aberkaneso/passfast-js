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

// ── Response Types ──

export interface GeneratePassResponse {
  passId: string;
  pkpassData: Uint8Array;
  existed: boolean;
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
