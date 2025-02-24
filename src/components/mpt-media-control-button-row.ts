import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { MediaControlButton } from "../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";

@customElement("mpt-media-control-button-row")
export class MediaControlButtonRow extends LitElement {
  @property({ attribute: false }) public controls?: MediaControlButton[];

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
              .iconPath=${control.iconPath}
              size=${control.size ?? nothing}
              shape=${control.shape ?? nothing}
              variant=${control.variant ?? nothing}
            ></mpt-button>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      --button-row-gap: 0px;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: var(--button-row-gap);
    }

    .controls.center {
      justify-content: center;
    }
  `;
}
