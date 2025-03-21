import { html, LitElement, nothing } from "lit";
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
}
