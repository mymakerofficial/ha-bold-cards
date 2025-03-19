export interface RenderTemplateResult {
  result: string;
  listeners: TemplateListeners;
}

export interface RenderTemplateError {
  error: string;
  level: "ERROR" | "WARNING";
}

export interface TemplateListeners {
  all: boolean;
  domains: string[];
  entities: string[];
  time: boolean;
}

export type TemplatePreview = TemplatePreviewState | TemplatePreviewError;

interface TemplatePreviewState {
  state: string;
  attributes: Record<string, any>;
  listeners: TemplateListeners;
}

interface TemplatePreviewError {
  error: string;
}
