import { HomeAssistant } from "./lovelace";
import { HassEntity } from "home-assistant-js-websocket";

export interface MediaPlayerVolumeSliderCardFeatureConfig {
  type: "media-player-volume-slider";
}

export type LovelaceCardFeatureConfig =
  | MediaPlayerVolumeSliderCardFeatureConfig
  | {
      // TODO
      type: string;
    };

export interface LovelaceCardFeature extends HTMLElement {
  hass?: HomeAssistant;
  stateObj?: HassEntity;
  setConfig(config: LovelaceCardFeatureConfig);
  color?: string;
}
