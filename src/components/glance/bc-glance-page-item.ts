import { BoldHassElement } from "../hass-element";
import { customElement, property } from "lit/decorators";
import { css, html, nothing, svg } from "lit";
import { ConcreteCustomGlanceItem } from "../../lib/at-a-glance/types";
import { mdiCircle } from "@mdi/js";

@customElement("bc-glance-page-item")
export class BcGlancePageItem extends BoldHassElement {
  @property({ attribute: false }) public item?: ConcreteCustomGlanceItem;

  protected _getIcon() {
    if (!this.item) {
      return nothing;
    }

    return html`<ha-icon icon=${this.item.icon}></ha-icon>`;
  }

  render() {
    const item = this.item;

    if (!item) {
      return nothing;
    }

    return html`
      ${item.icon
        ? html`<div class="icon">${this._getIcon()}</div>`
        : html`<ha-svg-icon
            class="spacer-dot"
            .path=${mdiCircle}
          ></ha-svg-icon>`}
      <span>${item.content}</span>
    `;
  }

  static get styles() {
    return css`
      :host {
        height: 24px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .icon {
        width: 24px;
        height: 24px;
      }

      .icon > * {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .spacer-dot {
        width: 4px;
        height: 4px;
        color: var(--secondary-text-color);
        opacity: 0.9;
      }

      span {
        font-size: 1rem;
      }
    `;
  }
}
