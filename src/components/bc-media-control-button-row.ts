import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { classMap } from "lit-html/directives/class-map";
import {
  ConcreteMediaButtonControl,
  MediaButtonAction,
} from "../lib/controls/types";

export class MediaControlButtonActionEvent extends CustomEvent<{
  action: MediaButtonAction;
}> {
  constructor(action: MediaButtonAction) {
    super("action", {
      detail: { action },
    });
  }
}

@customElement("bc-media-control-button-row")
export class MediaControlButtonRow extends LitElement {
  @property({ attribute: false })
  public controls?: ConcreteMediaButtonControl[];

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
            <bc-button
              .icon=${control.icon}
              size=${control.size ?? nothing}
              shape=${control.shape ?? nothing}
              variant=${control.variant ?? nothing}
              .disabled=${control.disabled}
              @click=${() => this._handleClick(control.action)}
            ></bc-button>
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
