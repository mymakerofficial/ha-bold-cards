import { LitElement } from "lit";
import { fireEvent, ValidHassDomEvent } from "custom-card-helpers";

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
}
