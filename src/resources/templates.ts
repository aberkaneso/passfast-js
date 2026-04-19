import type { HttpClient } from "../http-client.js";
import type {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  ListTemplatesParams,
  DeleteTemplateParams,
  DeleteTemplateResponse,
} from "../types.js";

export class Templates {
  constructor(private http: HttpClient) {}

  /** Create a new template (draft). */
  async create(params: CreateTemplateRequest): Promise<Template> {
    return this.http.request<Template>({
      method: "POST",
      path: "/manage-templates",
      body: params,
    });
  }

  /** List templates. Pass `{ archived: true }` to return archived templates instead. */
  async list(params?: ListTemplatesParams): Promise<Template[]> {
    return this.http.request<Template[]>({
      method: "GET",
      path: "/manage-templates",
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }

  /** Get a template by ID. */
  async get(templateId: string): Promise<Template> {
    return this.http.request<Template>({
      method: "GET",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
    });
  }

  /** Update a draft template. Published templates cannot be modified. */
  async update(templateId: string, params: UpdateTemplateRequest): Promise<Template> {
    return this.http.request<Template>({
      method: "PATCH",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
      body: params,
    });
  }

  /** Archive a template (soft delete). Pass `{ permanent: true }` to delete permanently. */
  async delete(templateId: string, params?: DeleteTemplateParams): Promise<DeleteTemplateResponse> {
    return this.http.request<DeleteTemplateResponse>({
      method: "DELETE",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }

  /** Publish a draft template so passes can be generated from it. */
  async publish(templateId: string): Promise<Template> {
    return this.http.request<Template>({
      method: "POST",
      path: `/manage-templates/${encodeURIComponent(templateId)}/publish`,
    });
  }
}
