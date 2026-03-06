import type { HttpClient } from "../http-client.js";
import type {
  Template,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  DeleteTemplateResponse,
  ListTemplatesParams,
  DeleteTemplateParams,
} from "../types.js";

export class Templates {
  constructor(private http: HttpClient) {}

  /** Create a new template. */
  async create(params: CreateTemplateRequest): Promise<Template> {
    return this.http.request<Template>({
      method: "POST",
      path: "/manage-templates",
      body: params,
    });
  }

  /** List all templates. */
  async list(params?: ListTemplatesParams): Promise<Template[]> {
    return this.http.request<Template[]>({
      method: "GET",
      path: "/manage-templates",
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }

  /** Get a single template by ID. */
  async get(templateId: string): Promise<Template> {
    return this.http.request<Template>({
      method: "GET",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
    });
  }

  /** Update a template. */
  async update(templateId: string, params: UpdateTemplateRequest): Promise<Template> {
    return this.http.request<Template>({
      method: "PATCH",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
      body: params,
    });
  }

  /** Delete a template. */
  async delete(templateId: string, params?: DeleteTemplateParams): Promise<DeleteTemplateResponse> {
    return this.http.request<DeleteTemplateResponse>({
      method: "DELETE",
      path: `/manage-templates/${encodeURIComponent(templateId)}`,
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }

  /** Publish a template (makes it available for pass generation). */
  async publish(templateId: string): Promise<Template> {
    return this.http.request<Template>({
      method: "POST",
      path: `/manage-templates/${encodeURIComponent(templateId)}/publish`,
    });
  }
}
