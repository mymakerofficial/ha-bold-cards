import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";

@customElement("mpt-large-button")
export class LargeButton extends LitElement {
  @property() public iconPath?: string;

  protected render() {
    return html`
      <mpt-control-surface>
        <ha-svg-icon .path=${this.iconPath}></ha-svg-icon>
      </mpt-control-surface>
    `;
  }

  static styles = css`
    :host {
      --button-size: 64px;
      --icon-size: 40%;
    }

    mpt-control-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--button-size);
      height: var(--button-size);
      --control-button-border-radius: calc(
        var(--ha-card-border-radius, 12px) / 2
      );
    }

    ha-svg-icon {
      width: var(--icon-size);
      height: var(--icon-size);
      max-height: 80%;
      --mdc-icon-size: 100%;
      transition: transform 180ms ease-in-out;
      pointer-events: none;
    }
  `;
}
