import { customElement, property } from "lit/decorators";
import { BoldHassElement } from "../hass-element";
import { GlancePageConfig, GlancePageType } from "../../lib/at-a-glance/types";
import { html, nothing } from "lit";

@customElement("bc-glance-page")
export class BcGlancePage extends BoldHassElement {
  @property({ attribute: false }) public config?: GlancePageConfig;

  render() {
    if (this.config?.type === GlancePageType.CUSTOM) {
      return html`<bc-custom-glance-page
        .hass=${this.hass}
        .config=${this.config}
      ></bc-custom-glance-page>`;
    }

    return nothing;
  }
}
