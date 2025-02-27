import { LitElement } from "lit";
import { HomeAssistant, LovelaceCard } from "../types/ha/lovelace";
import { property, state } from "lit/decorators";
import { LovelaceCardConfigWithFeatures } from "../types/card";
import { isCustomFeatureElement } from "../features/base";
import { getFeatureDoesRender, getFeatureSize } from "../features/size";
import { MediaPlayerEntity } from "../types/ha/entity";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";

export abstract class CustomLovelaceCard<
    TConfig extends LovelaceCardConfigWithFeatures,
    TStateObj extends HassEntityBase = HassEntityBase,
  >
  extends LitElement
  implements LovelaceCard
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected _config?: TConfig;

  public setConfig(config: TConfig): void {
    // TODO: actually validate the config
    if (!config) {
      throw new Error("Invalid configuration");
    }

    this._config = {
      ...config,
      features: config.features?.map((feature) => ({
        ...feature,
        __custom_internals: {
          parent_card_type: config.type,
        },
      })),
    };
  }

  protected get _stateObj() {
    const entityId = this._config?.entity;
    return this.hass?.states[entityId] as TStateObj | undefined;
  }

  protected abstract _getSizeWithoutFeatures(): number;

  // get the size of all features combined **including** features that do not render
  protected _getTotalFeatureSize() {
    if (!this._config?.features) {
      return 0;
    }
    if (!this._stateObj) {
      return 0;
    }
    const size = this._config.features?.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, this._stateObj!);
      return totalSize + featureSize;
    }, 0);
    return size || 0;
  }

  // get the size of all features that render combined
  protected _getRenderedFeatureSize() {
    if (!this._config?.features) {
      return 0;
    }
    if (!this._stateObj) {
      return 0;
    }
    const size = this._config.features?.reduce((totalSize, feature) => {
      const doesRender = getFeatureDoesRender(feature, this._stateObj!);
      if (!doesRender) {
        return totalSize;
      }
      const featureSize = getFeatureSize(feature, this._stateObj!);
      return totalSize + featureSize;
    }, 0);
    return size || 0;
  }

  public getCardSize(): number | Promise<number> {
    return this._getSizeWithoutFeatures() + this._getRenderedFeatureSize();
  }
}
