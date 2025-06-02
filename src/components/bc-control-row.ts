import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { classMap } from "lit-html/directives/class-map";
import { ConcreteControl, ControlType } from "../lib/controls/types";
import { handleMediaPlayerAction } from "../helpers/media-player";
import { HassEntityBase } from "home-assistant-js-websocket";
import { HomeAssistant } from "../types/ha/lovelace";
import { MediaPlayerEntity } from "../types/ha/entity";

@customElement("bc-control-row")
export class ControlRow extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: HassEntityBase;

  @property({ attribute: false })
  public controls?: ConcreteControl[];

  @property() public center?: boolean;

  private _handleClick(control: ConcreteControl) {
    if (control.type === ControlType.MEDIA_BUTTON) {
      if (!this.stateObj || !this.hass) {
        return;
      }

      // TODO: refactor this
      handleMediaPlayerAction({
        hass: this.hass,
        stateObj: this.stateObj as MediaPlayerEntity, // TODO check type
        action: control.action,
      }).then();
    }
  }

  protected render() {
    return html`
      <div
        class="controls ${classMap({
          center: !!this.center,
        })}"
      >
        ${this.controls?.map((control) => {
          // TODO extract this

          if (control.type === ControlType.MEDIA_BUTTON) {
            return html`
              <bc-button
                .icon=${control.icon}
                size=${control.size}
                shape=${control.shape}
                variant=${control.variant}
                .disabled=${control.disabled}
                @click=${() => this._handleClick(control)}
              ></bc-button>
            `;
          }

          if (control.type === ControlType.MEDIA_POSITION) {
            return html`
              <bc-media-position-control
                .stateObj=${this.stateObj as MediaPlayerEntity}
                .disabled=${control.disabled}
                .timestampPosition=${control.timestamp_position}
                .fullWidth=${true}
              ></bc-media-position-control>
            `;
          }

          if (control.type === ControlType.SPACER) {
            return html`<div style="flex: 1"></div>`;
          }

          return nothing;
        })}
      </div>
    `;
  }

  static styles = css`
    :host {
      --button-row-gap: 0px;
    }

    .controls {
      width: 100%;
      display: flex;
      align-items: center;
      gap: var(--button-row-gap);
    }

    .controls.center {
      justify-content: center;
    }

    bc-media-position-control {
      flex: 1;
    }
  `;
}
