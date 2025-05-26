import { customElement, property } from "lit/decorators.js";
import { BoldElement } from "./bold-element";
import { css, html, nothing } from "lit";
import { isDefined } from "../lib/helpers";
import { TemplateResult } from "lit-element";

@customElement("bc-form-help-box")
export class BcFormHelpBox extends BoldElement {
  @property({ attribute: false }) public icon?: string;
  @property({ attribute: false }) public header?: string | TemplateResult;
  @property({ attribute: false }) public content?: string | TemplateResult;
  @property({ attribute: false }) public actions?: TemplateResult;

  protected render() {
    return html`
      ${isDefined(this.icon)
        ? html` <bc-icon class="icon" .icon=${this.icon}></bc-icon> `
        : nothing}
      <div class="container">
        ${isDefined(this.header)
          ? html`<h3 class="header">${this.header}</h3>`
          : nothing}
        ${isDefined(this.content)
          ? html`<p class="content">${this.content}</p>`
          : nothing}
        ${isDefined(this.actions)
          ? html`<div class="action">${this.actions}</div>`
          : nothing}
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        padding: 16px;
        border-radius: 6px;
        background-color: var(--card-background-color);
        color: var(--secondary-text-color);
        display: flex;
        gap: 8px;
      }

      :host * {
        margin: 0;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex-grow: 1;
      }

      .icon {
        color: var(--primary-text-color);
        width: 24px;
        height: 24px;
        flex-shrink: 0;
      }

      .header {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .content {
        grid-area: content;
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .action {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `,
  ];
}
