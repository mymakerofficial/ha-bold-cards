import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { isDefined } from "../lib/helpers";

@customElement("bc-form-element")
export class Button extends LitElement {
  @property({ attribute: false }) public label?: string;

  render() {
    return html`
      ${isDefined(this.label) ? html`<label>${this.label}</label>` : nothing}
      <div class="content">
        <slot></slot>
      </div>
    `;
  }

  static styles = [
    css`
      :host,
      .content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      label {
        display: block;
        margin-bottom: 4px;
        font-size: var(--bc-font-size);
        color: var(--bc-text-color);
      }
    `,
  ];
}
