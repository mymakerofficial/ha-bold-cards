import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";
import { MediaControlButton } from "../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";

@customElement("mpt-media-control-button-row")
export class MediaControlButtonRow extends LitElement {
  @property() public controls?: MediaControlButton[];

  @property() public center?: boolean;

  protected render() {
    return html`
      <div
        class="controls ${classMap({
          center: !!this.center,
        })}"
      >
        ${this.controls?.map(
          (control) => html`
            <mpt-button
              iconPath=${control.iconPath}
              size=${control.size}
              shape=${control.shape}
              variant=${control.variant}
            ></mpt-button>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    .controls {
      display: flex;
      align-items: center;
    }

    .controls.center {
      justify-content: center;
    }
  `;
}
