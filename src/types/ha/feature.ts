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

export interface LovelaceCardFeatureContext {
  entity_id?: string;
}

export interface FeatureConfigInternals {
  __custom_internals: {
    parent_card_type: string;
  };
}

export type FeatureConfigWithInternals<
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> = TConfig & FeatureConfigInternals;

export type FeatureConfigWithMaybeInternals<
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> = TConfig & Partial<FeatureConfigInternals>;

export interface LovelaceCardFeature<
  TStateObj extends HassEntity = HassEntity,
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> extends HTMLElement {
  hass?: HomeAssistant;
  stateObj?: TStateObj;
  setConfig(config: FeatureConfigWithMaybeInternals<TConfig>): void;
  color?: string;
}

export interface CustomCardFeatureEntry {
  type: string;
  name?: string;
  supported?: (stateObj: HassEntity) => boolean;
  configurable?: boolean;
}

export interface CustomCardFeatureSizeEntry<
  TStateObj extends HassEntity = HassEntity,
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> {
  getSize?: (
    config: FeatureConfigWithMaybeInternals<TConfig>,
    stateObj: TStateObj,
  ) => number;
  doesRender?: (
    config: FeatureConfigWithMaybeInternals<TConfig>,
    stateObj: TStateObj,
  ) => boolean;
}

export interface CustomCardFeatureEntryWithSize<
  TStateObj extends HassEntity = HassEntity,
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> extends CustomCardFeatureEntry,
    CustomCardFeatureSizeEntry<TStateObj, TConfig> {}
