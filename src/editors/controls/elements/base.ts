import { LitElement } from "lit";
import { property } from "lit/decorators";
import { ControlConfig } from "../../../lib/controls/types";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { FeatureInternals } from "../../../types/ha/feature";
import { HassEntityBase } from "home-assistant-js-websocket";

export class ControlEditorBase<
  TConfig = ControlConfig,
  TStateObj = HassEntityBase,
> extends LitElement {
  @property({ attribute: false }) public control?: TConfig;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: TStateObj;
  @property({ attribute: false })
  public internals?: FeatureInternals;

  protected _handleValueChanged(field: keyof TConfig, ev: CustomEvent) {
    ev.stopPropagation();

    if (!this.control) {
      return;
    }

    const newValue = {
      ...this.control,
      [field]: ev.detail.value === "" ? undefined : ev.detail.value,
    };

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }
}
