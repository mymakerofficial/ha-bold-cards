import { customElement, property } from "lit/decorators";
import { BoldHassElement } from "../hass-element";
import { GlanceItemConfig, GlanceItemType } from "../../lib/at-a-glance/types";
import { html, nothing } from "lit";

@customElement("bc-glance-item")
export class BcGlanceItem extends BoldHassElement {
  @property({ attribute: false }) public config?: GlanceItemConfig;

  render() {
    if (this.config?.type === GlanceItemType.CUSTOM) {
      return html`<bc-custom-glance-item
        .hass=${this.hass}
        .config=${this.config}
      ></bc-custom-glance-item>`;
    }

    return nothing;
  }
}
