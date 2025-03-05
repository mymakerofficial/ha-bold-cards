import { LitElement } from "lit";
import {
  CustomCardFeatureEntryWithSize,
  FeatureConfigWithMaybeInternals,
  LovelaceCardFeature,
  LovelaceCardFeatureConfig,
} from "../types/ha/feature";
import { property, state } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";

export abstract class CustomLovelaceCardFeature<
    TStateObj extends HassEntity = HassEntity,
    TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
  >
  extends LitElement
  implements LovelaceCardFeature<TStateObj, TConfig>
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: TStateObj;

  @state() protected _config?: FeatureConfigWithMaybeInternals<TConfig>;

  public setConfig(config: FeatureConfigWithMaybeInternals<TConfig>) {
    this._config = config;
  }

  protected get _isInCustomCard() {
    return this._config?.__custom_internals !== undefined;
  }

  static registerCustomFeature<
    TStateObj extends HassEntity = HassEntity,
    TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
  >({
    getSize,
    doesRender,
    ...entry
  }: CustomCardFeatureEntryWithSize<TStateObj, TConfig>) {
    (window as any).customCardFeatures =
      (window as any).customCardFeatures || [];
    (window as any).customCardFeatures.push(entry);

    (window as any).__customCardFeaturesSizeMap =
      (window as any).__customCardFeaturesSizeMap || new Map();
    (window as any).__customCardFeaturesSizeMap.set(`custom:${entry.type}`, {
      getSize,
      doesRender,
    });
  }
}

export function isCustomFeatureElement(
  el: any,
): el is CustomLovelaceCardFeature {
  return el.isCustomFeature?.();
}
