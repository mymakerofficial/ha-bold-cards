import { HomeAssistant } from "./lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { MediaPlayerControlButtonRowFeatureConfig } from "../../features/media-player-control-button-row/types";
import { MediaPlayerProgressControlFeatureConfig } from "../../features/media-player-progress-control/types";

export interface MediaPlayerVolumeSliderCardFeatureConfig {
  type: "media-player-volume-slider";
}

export type LovelaceCardFeatureConfig =
  | MediaPlayerVolumeSliderCardFeatureConfig
  | MediaPlayerControlButtonRowFeatureConfig
  | MediaPlayerProgressControlFeatureConfig;

export interface LovelaceCardFeature extends HTMLElement {
  hass?: HomeAssistant;
  stateObj?: HassEntity;
  setConfig(config: LovelaceCardFeatureConfig);
  color?: string;
}
