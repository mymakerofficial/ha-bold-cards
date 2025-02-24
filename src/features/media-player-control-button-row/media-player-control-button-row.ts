import { customElement, property, state } from "lit/decorators";
import { css, html, LitElement } from "lit";
import { LovelaceCardFeature } from "../../types/ha/feature";
import { HomeAssistant } from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { MediaPlayerControlButtonRowFeatureConfig } from "./types";
import {
  getMediaControls,
  MediaControlAction,
} from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { ButtonShape } from "../../components/mpt-button";

(window as any).customCardFeatures = (window as any).customCardFeatures || [];
(window as any).customCardFeatures.push({
  type: "media-player-control-button-row",
  name: "Media Player Control Button Row",
  // supported: (stateObj) => true,
  configurable: false,
});

@customElement("media-player-control-button-row")
class MediaPlayerControlButtonRowFeature
  extends LitElement
  implements LovelaceCardFeature
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @state() private _config?: MediaPlayerControlButtonRowFeatureConfig;

  static getStubConfig(): MediaPlayerControlButtonRowFeatureConfig {
    return {
      type: "custom:media-player-control-button-row",
      controls: Object.values(MediaControlAction),
    };
  }

  public setConfig(config: MediaPlayerControlButtonRowFeatureConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return null;
    }

    const controls = getMediaControls(this.stateObj as MediaPlayerEntity)
      .filter(({ action }) => this._config?.controls?.includes(action))
      .map((it) => ({
        ...it,
      }));

    return html`<mpt-media-control-button-row
      center=${true}
      .controls=${controls}
    ></mpt-media-control-button-row>`;
  }

  static get styles() {
    return css`
      mpt-media-control-button-row {
        margin: 0 8px;
        --button-row-gap: 8px;
      }
    `;
  }
}
