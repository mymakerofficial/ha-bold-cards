import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("bc-spinner")
export class BcSpinner extends LitElement {
  @property({ attribute: false }) public label?: string;

  protected render(): unknown {
    return html`
      <ha-spinner size="small"></ha-spinner>
      <span>${this.label}</span>
    `;
  }

  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }
  `;
}
