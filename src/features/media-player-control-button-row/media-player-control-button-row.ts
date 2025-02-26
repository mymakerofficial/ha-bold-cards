import { customElement, state } from "lit/decorators";
import { css, html } from "lit";
import { HassEntity } from "home-assistant-js-websocket";
import { MediaPlayerControlButtonRowFeatureConfig } from "./types";
import {
  getMediaControls,
  handleMediaPlayerAction,
  MediaControlAction,
} from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { ButtonSize, limitButtonSize } from "../../components/mpt-button";
import { MediaControlButtonActionEvent } from "../../components/mpt-media-control-button-row";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { classMap } from "lit-html/directives/class-map";

(window as any).customCardFeatures = (window as any).customCardFeatures || [];
(window as any).customCardFeatures.push({
  type: "media-player-control-button-row",
  name: "Media Player Control Button Row",
  supported: (stateObj: HassEntity) =>
    computeDomain(stateObj.entity_id) === "media_player",
  configurable: false,
});

@customElement("media-player-control-button-row")
class MediaPlayerControlButtonRowFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  MediaPlayerControlButtonRowFeatureConfig
> {
  static getStubConfig(): MediaPlayerControlButtonRowFeatureConfig {
    return {
      type: "custom:media-player-control-button-row",
      controls: Object.values(MediaControlAction),
    };
  }

  private get _controls() {
    return getMediaControls(this.stateObj!)
      .filter(({ action }) => this._config?.controls?.includes(action))
      .map((it) => ({
        ...it,
        size: limitButtonSize(
          it.size ?? ButtonSize.MD,
          this._isInCustomCard ? ButtonSize.XL : ButtonSize.SM,
        ),
      }));
  }

  private get _hasLargeButtons() {
    return this._controls.some(
      ({ size }) => size === ButtonSize.LG || size === ButtonSize.XL,
    );
  }

  public getFeatureSize() {
    return this._hasLargeButtons ? 2 : 1;
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return null;
    }

    return html`
      <div
        class=${classMap({
          "extra-height": this._hasLargeButtons,
        })}
      >
        <mpt-media-control-button-row
          center=${true}
          .controls=${this._controls}
          @action="${this._handleAction}"
        ></mpt-media-control-button-row>
      </div>
    `;
  }

  private _handleAction(event: MediaControlButtonActionEvent) {
    handleMediaPlayerAction({
      hass: this.hass!,
      stateObj: this.stateObj!,
      action: event.detail.action,
    }).then();
  }

  static get styles() {
    return css`
      mpt-media-control-button-row {
        --button-row-gap: 8px;
      }

      .extra-height {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(var(--feature-height) * 2 + var(--feature-padding));
      }
    `;
  }
}
