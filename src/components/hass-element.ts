import { property } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { LitElement } from "lit";
import { HassObjectMixin } from "../lib/hass-object";
import { fireEvent, ValidHassDomEvent } from "custom-card-helpers";

export class BoldHassElement extends HassObjectMixin(LitElement) {
  @property({ attribute: false }) public hass?: HomeAssistant;

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
}
