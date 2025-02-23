import { customElement, property, state } from "lit/decorators";
import { css, html, LitElement } from "lit";
import {
  LovelaceCardFeature,
  LovelaceCardFeatureConfig,
} from "../types/ha/feature";
import { HomeAssistant } from "../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { styleMap } from "lit-html/directives/style-map";
import {
  mdiRepeatOff,
  mdiShuffle,
  mdiSkipNext,
  mdiSkipPrevious,
} from "@mdi/js";

(window as any).customCardFeatures = (window as any).customCardFeatures || [];
(window as any).customCardFeatures.push({
  type: "media-player-progress",
  name: "Media Player Progress",
  // supported: (stateObj) => true,
  configurable: false,
});

@customElement("media-player-progress")
class MediaPlayerProgressFeature
  extends LitElement
  implements LovelaceCardFeature
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @state() private _config?: LovelaceCardFeatureConfig;

  static getStubConfig(): LovelaceCardFeatureConfig {
    return {
      type: "media-player-progress",
    };
  }

  public setConfig(config: LovelaceCardFeatureConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return null;
    }

    return html`
      <div class="container">
        <mpt-large-button .iconPath=${mdiShuffle}></mpt-large-button>
        <mpt-large-button .iconPath=${mdiSkipPrevious}></mpt-large-button>
        <ha-slider min=${0} max=${100} value=${50}></ha-slider>
        <mpt-large-button .iconPath=${mdiSkipNext}></mpt-large-button>
        <mpt-large-button .iconPath=${mdiRepeatOff}></mpt-large-button>
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

      mpt-large-button {
        --button-size: var(--feature-height, 42px);
        --icon-size: var(--feature-height, 42px);
      }

      ha-slider {
        --md-sys-color-primary: var(--tile-color);
        --_inactive-track-color: rgb(from var(--tile-color) r g b / 20%);
        flex: 1;
      }
    `;
  }
}
