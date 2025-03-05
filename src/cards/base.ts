import { LitElement } from "lit";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
} from "../types/ha/lovelace";
import { property, state } from "lit/decorators";
import {
  CustomCardEntry,
  LovelaceCardConfigWithEntity,
  LovelaceCardConfigWithFeatures,
} from "../types/card";
import { getFeatureDoesRender, getFeatureSize } from "../features/size";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { FeatureConfigWithMaybeInternals } from "../types/ha/feature";

export abstract class BoldLovelaceCard<TConfig extends LovelaceCardConfig>
  extends LitElement
  implements LovelaceCard<TConfig>
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() protected _config?: TConfig;

  public setConfig(config: TConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
  }

  abstract getCardSize(): number | Promise<number>;

  static registerCustomCard(entry: CustomCardEntry) {
    (window as any).customCards = (window as any).customCards || [];
    (window as any).customCards.push({
      preview: true,
      documentationURL: "https://github.com/mymakerofficial/ha-bold-cards",
      ...entry,
    });
  }
}

export abstract class BoldCardWithEntity<
  TConfig extends LovelaceCardConfigWithEntity,
  TStateObj extends HassEntityBase = HassEntityBase,
> extends BoldLovelaceCard<TConfig> {
  protected get _stateObj() {
    if (!this._config?.entity) {
      return undefined;
    }
    const entityId = this._config.entity;
    return this.hass?.states[entityId] as TStateObj | undefined;
  }
}

export abstract class BoldCardWithFeatures<
  TConfig extends LovelaceCardConfigWithFeatures,
  TStateObj extends HassEntityBase = HassEntityBase,
> extends BoldCardWithEntity<TConfig, TStateObj> {
  public setConfig(config: TConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    super.setConfig({
      ...config,
      // inject custom internals into features config
      //  this is the only way to pass information and allows features to be more flexible
      features: config.features?.map((feature) => ({
        ...feature,
        __custom_internals: {
          parent_card_type: config.type,
        },
      })),
    });
  }

  protected get _renderingFeatures(): FeatureConfigWithMaybeInternals[] {
    if (!this._config?.features) {
      return [];
    }
    if (!this._stateObj) {
      return [];
    }
    return this._config.features.filter((feature) => {
      return getFeatureDoesRender(feature, this._stateObj!);
    });
  }

  protected abstract _getSizeWithoutFeatures(): number;

  // get the size of all features combined **including** features that do not render
  protected _getTotalFeatureSize() {
    if (!this._stateObj) {
      return 0;
    }
    if (!this._config?.features) {
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
    if (!this._stateObj) {
      return 0;
    }
    if (!this._renderingFeatures) {
      return 0;
    }
    return this._renderingFeatures.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, this._stateObj!);
      return totalSize + featureSize;
    }, 0);
  }

  public getCardSize(): number | Promise<number> {
    return this._getSizeWithoutFeatures() + this._getRenderedFeatureSize();
  }
}
