import { HomeAssistant, LovelaceCardFeatureEditor } from "./lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { BoldMediaPlayerControlRowFeatureConfig } from "../../features/media-player-control-row-feature/types";
import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";
import { BoldMediaPlayerSourceSelectFeatureConfig } from "../../features/media-player-source-select-feature/types";
import { BoldMediaPlayerMediaBrowserFeatureConfig } from "../../features/media-player-media-browser-feature/types";
import { BoldFeatureStackFeatureConfig } from "../../features/feature-stack-feature/types";

export interface MediaPlayerVolumeSliderCardFeatureConfig {
  type: "media-player-volume-slider";
}

export type LovelaceCardFeatureConfig =
  | MediaPlayerVolumeSliderCardFeatureConfig
  | BoldMediaPlayerControlRowFeatureConfig
  | BoldMediaPlayerSourceSelectFeatureConfig
  | BoldMediaPlayerMediaBrowserFeatureConfig
  | BoldFeatureStackFeatureConfig;

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
