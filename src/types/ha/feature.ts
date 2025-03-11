import { HomeAssistant, LovelaceCardFeatureEditor } from "./lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { BoldMediaPlayerControlRowFeatureConfig } from "../../features/media-player-control-row-feature/types";

export interface MediaPlayerVolumeSliderCardFeatureConfig {
  type: "media-player-volume-slider";
}

export type LovelaceCardFeatureConfig =
  | MediaPlayerVolumeSliderCardFeatureConfig
  | BoldMediaPlayerControlRowFeatureConfig;

export interface FeatureInternals {
  parent_card_type: string;
  is_inlined: boolean;
}

export interface FeatureConfigInternals {
  __custom_internals: FeatureInternals;
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

export type Constructor<T = any> = new (...args: any[]) => T;

export interface LovelaceCardFeatureConstructor
  extends Constructor<LovelaceCardFeature> {
  getStubConfig?: (
    hass: HomeAssistant,
    stateObj?: HassEntity,
  ) => LovelaceCardFeatureConfig;
  getConfigElement?: () => LovelaceCardFeatureEditor;
  isSupported?: (stateObj?: HassEntity) => boolean;
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
