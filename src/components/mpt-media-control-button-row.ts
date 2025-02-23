import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";
import { MediaControlButton } from "../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";

@customElement("mpt-media-control-button-row")
export class MediaControlButtonRow extends LitElement {
  @property({ attribute: false }) public controls?: MediaControlButton[];

  @property({ attribute: false }) public center?: boolean;
  @property({ attribute: false }) public small?: boolean;

  protected render() {
    return html`
      <div
        class="controls ${classMap({
          center: !!this.center,
          small: !!this.small,
        })}"
      >
        ${this.controls?.map(
          (control) => html`
            <mpt-large-button .iconPath=${control.iconPath}></mpt-large-button>
          `,
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      --button-size: 64px;
      --icon-size: 40%;
    }

    .controls {
      display: flex;
    }

    .controls.center {
      justify-content: center;
    }

    .controls.small mpt-large-button {
      --button-size: var(--feature-height, 42px);
      --icon-size: var(--feature-height, 42px);
    }
  `;
}
