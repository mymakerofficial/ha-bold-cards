import { Connection, UnsubscribeFunc } from "home-assistant-js-websocket";
import {
  RenderTemplateError,
  RenderTemplateResult,
  TemplatePreview,
} from "./types";
import { HomeAssistant } from "../../types/ha/lovelace";

export interface RenderTemplateParams {
  onChange: (result: RenderTemplateResult | RenderTemplateError) => void;
  template: string;
  entity_ids?: string | string[];
  variables?: Record<string, unknown>;
  timeout?: number;
  strict?: boolean;
  report_errors?: boolean;
}

export function subscribeToRenderTemplate(
  conn: Connection,
  { onChange, ...params }: RenderTemplateParams,
): Promise<UnsubscribeFunc> {
  return conn.subscribeMessage(
    (msg: RenderTemplateResult | RenderTemplateError) => onChange(msg),
    {
      type: "render_template",
      ...params,
    },
  );
}

export function subscribeToPreviewTemplate(
  conn: Connection,
  flow_id: string,
  flow_type: "config_flow" | "options_flow",
  user_input: Record<string, any>,
  callback: (preview: TemplatePreview) => void,
): Promise<UnsubscribeFunc> {
  return conn.subscribeMessage(callback, {
    type: "template/start_preview",
    flow_id,
    flow_type,
    user_input,
  });
}

export function isTemplateError(
  result: RenderTemplateResult | RenderTemplateError,
): result is RenderTemplateError {
  return "error" in result;
}

export function isTemplateResult(
  result: RenderTemplateResult | RenderTemplateError,
): result is RenderTemplateResult {
  return "result" in result;
}
