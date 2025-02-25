import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import {
  handleMediaPlayerAction,
  MediaControlAction,
  MediaControlButton,
} from "../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";

export class MediaControlButtonActionEvent extends CustomEvent<{
  action: MediaControlAction;
}> {
  constructor(action: MediaControlAction) {
    super("action", {
      detail: { action },
    });
  }
}

@customElement("mpt-media-control-button-row")
export class MediaControlButtonRow extends LitElement {
  @property({ attribute: false }) public controls?: MediaControlButton[];

  @property() public center?: boolean;

  private _handleClick(action: string) {
    this.dispatchEvent(new MediaControlButtonActionEvent(action));
  }

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
              @click=${() => this._handleClick(control.action)}
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
