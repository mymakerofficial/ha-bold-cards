import { customElement, property, state } from "lit/decorators";
import { css, html, LitElement } from "lit";
import { LovelaceCardFeature } from "../../types/ha/feature";
import { HomeAssistant } from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { MediaPlayerProgressControlFeatureConfig } from "./types";
import {
  getMediaControls,
  MediaControlAction,
} from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { classMap } from "lit-html/directives/class-map";

(window as any).customCardFeatures = (window as any).customCardFeatures || [];
(window as any).customCardFeatures.push({
  type: "media-player-progress-control",
  name: "Media Player Progress",
  // supported: (stateObj) => true,
  configurable: false,
});

@customElement("media-player-progress-control")
class MediaPlayerProgressControlFeature
  extends LitElement
  implements LovelaceCardFeature
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @state() private _config?: MediaPlayerProgressControlFeatureConfig;

  static getStubConfig(): MediaPlayerProgressControlFeatureConfig {
    return {
      type: "media-player-progress-control",
      controls: Object.values(MediaControlAction),
    };
  }

  public setConfig(config: MediaPlayerProgressControlFeatureConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return null;
    }

    const controls = getMediaControls(
      this.stateObj as MediaPlayerEntity,
    ).filter(({ action }) => this._config?.controls?.includes(action));

    const left = controls.filter(({ action }) =>
      [
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.SHUFFLE_SET,
        MediaControlAction.MEDIA_PREVIOUS_TRACK,
      ].includes(action),
    );

    const right = controls.filter(({ action }) =>
      [
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
        MediaControlAction.MEDIA_NEXT_TRACK,
        MediaControlAction.REPEAT_SET,
      ].includes(action),
    );

    return html`
      <div
        class="container ${classMap({
          "full-width": !!this._config.full_width,
        })}"
      >
        <mpt-media-control-button-row
          .small=${true}
          .controls=${left}
        ></mpt-media-control-button-row>
        <ha-slider min=${0} max=${100} value=${50}></ha-slider>
        <mpt-media-control-button-row
          .small=${true}
          .controls=${right}
        ></mpt-media-control-button-row>
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: var(--feature-height, 42px);
        width: 80%;
        margin: 0 auto;
        border-radius: var(--feature-border-radius, 12px);
      }

      .container.full-width {
        width: 100%;
      }

      ha-slider {
        --md-sys-color-primary: var(--tile-color);
        --_inactive-track-color: rgb(from var(--tile-color) r g b / 20%);
        flex: 1;
      }
    `;
  }
}
