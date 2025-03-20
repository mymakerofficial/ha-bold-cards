import { BoldHassElement } from "../hass-element";
import { customElement, property } from "lit/decorators";
import { css, html } from "lit";
import { TemplateResult } from "lit-element";

@customElement("bc-glance-page-item")
export class BcGlancePageItem extends BoldHassElement {
  @property({ attribute: false }) public label = "";
  @property({ attribute: false }) public icon?: TemplateResult;

  render() {
    return html`
      <div class="icon">${this.icon}</div>
      <span>${this.label}</span>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
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

      span {
        font-size: 1rem;
        line-height: 24px;
      }
    `;
  }
}
