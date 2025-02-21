import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";

@customElement("mpt-large-button")
export class LargeButton extends LitElement {
  @property() public iconPath?: string;

  protected render() {
    return html`
      <ha-card role="button">
        <ha-ripple></ha-ripple>
        <ha-svg-icon .path=${this.iconPath}></ha-svg-icon>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      --ha-ripple-color: var(--state-color);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      height: 64px;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
    }

    ha-card:focus {
      outline: none;
    }

    ha-svg-icon {
      width: 40%;
      height: auto;
      max-height: 80%;
      color: var(--state-color);
      --mdc-icon-size: 100%;
      transition: transform 180ms ease-in-out;
      pointer-events: none;
    }
  `;
}
