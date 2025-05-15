import { html, LitElement } from "lit";
import { fireEvent, ValidHassDomEvent } from "custom-card-helpers";
import { run } from "../lib/result";
import { RenderResult } from "../lib/types";
import { ShowToastParams } from "../lib/hass-dom-events";

export class BoldElement extends LitElement {
  public fireEvent<HassEvent extends ValidHassDomEvent>(
    type: HassEvent,
    detail?: HASSDomEvents[HassEvent],
    options?: {
      bubbles?: boolean;
      cancelable?: boolean;
      composed?: boolean;
    },
  ) {
    return fireEvent(this, type, detail, options);
  }

  public showToast(params: ShowToastParams) {
    this.fireEvent("hass-notification", params);
  }

  protected renderSpinner({ label }: { label: string }) {
    return html`<bc-spinner .label=${label}></bc-spinner> `;
  }

  protected renderWithErrorHandling(renderFn: () => RenderResult) {
    return run(renderFn).getOrElse(
      (error) => html`<ha-alert alert-type="error">${error.message}</ha-alert>`,
    );
  }

  protected renderWith(renderFn: () => RenderResult) {
    return this.renderWithErrorHandling(() => renderFn());
  }
}
