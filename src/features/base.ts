import {
  CustomCardFeatureEntryWithSize,
  LovelaceCardFeature,
  LovelaceCardFeatureConfig,
} from "../types/ha/feature";
import { property, state } from "lit/decorators";
import { HassEntity } from "home-assistant-js-websocket";
import { FeatureConfigWithMaybeInternals } from "../lib/internals/types";
import { BoldHassElement } from "../components/hass-element";
import { stripCustomPrefix } from "../editors/cards/features/helpers";

export abstract class CustomLovelaceCardFeature<
    TStateObj extends HassEntity = HassEntity,
    TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
  >
  extends BoldHassElement
  implements LovelaceCardFeature<TStateObj, TConfig>
{
  @property({ attribute: false }) public stateObj?: TStateObj;

  @state() protected _config?: FeatureConfigWithMaybeInternals<TConfig>;

  public setConfig(config: FeatureConfigWithMaybeInternals<TConfig>) {
    this._config = config;
  }

  static get featureType() {
    return "";
  }

  protected get _internals() {
    return this._config?.__bold_custom_internals;
  }

  static registerCustomFeature<
    TStateObj extends HassEntity = HassEntity,
    TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
  >({
    getSize,
    doesRender,
    ...entry
  }: Omit<CustomCardFeatureEntryWithSize<TStateObj, TConfig>, "type">) {
    (window as any).customCardFeatures =
      (window as any).customCardFeatures || [];
    (window as any).customCardFeatures.push({
      entry,
      type: stripCustomPrefix(this.featureType),
    });

    (window as any).__customCardFeaturesSizeMap =
      (window as any).__customCardFeaturesSizeMap || new Map();
    (window as any).__customCardFeaturesSizeMap.set(this.featureType, {
      getSize,
      doesRender,
    });
  }
}
