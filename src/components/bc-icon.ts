import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators";
import { getBoldIconSvg, isBoldIcon } from "../lib/icons/icons";
import { isUndefined } from "../lib/helpers";

@customElement("bc-icon")
export class BcIcon extends LitElement {
  @property() public icon?: string;

  protected render(): unknown {
    if (isUndefined(this.icon)) {
      return nothing;
    }

    if (isBoldIcon(this.icon)) {
      return getBoldIconSvg(this.icon);
    }

    return html`<ha-icon .icon=${this.icon}></ha-icon>`;
  }

  static styles = css`
    :host {
      display: var(--ha-icon-display, inline-flex);
      align-items: center;
      justify-content: center;
      position: relative;
      vertical-align: middle;
      fill: var(--icon-primary-color, currentcolor);
      width: var(--mdc-icon-size, 24px);
      height: var(--mdc-icon-size, 24px);
    }

    svg {
      width: 100%;
      height: 100%;
      pointer-events: none;
      display: block;
    }

    path.primary-path {
      opacity: var(--icon-primary-opactity, 1);
    }

    path.secondary-path {
      fill: var(--icon-secondary-color, currentcolor);
      opacity: var(--icon-secondary-opactity, 0.5);
    }
  `;
}
