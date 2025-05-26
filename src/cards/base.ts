import { LovelaceCard, LovelaceCardConfig } from "../types/ha/lovelace";
import { state } from "lit/decorators.js";
import {
  CustomCardEntry,
  CustomCardEntryWithInternals,
  GetFeatureInternalsContext,
  LovelaceCardConfigWithEntity,
  LovelaceCardConfigWithFeatures,
} from "../types/card";
import { getFeatureDoesRender, getFeatureSize } from "../features/size";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import {
  FeatureConfigWithMaybeInternals,
  FeatureInternals,
} from "../lib/internals/types";
import { BoldHassElement } from "../components/hass-element";
import { stripCustomPrefix } from "../editors/cards/features/helpers";

export abstract class BoldLovelaceCard<TConfig extends LovelaceCardConfig>
  extends BoldHassElement
  implements LovelaceCard<TConfig>
{
  @state() protected _config?: TConfig;

  public setConfig(config: TConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
  }

  static get cardType() {
    return "";
  }

  abstract getCardSize(): number | Promise<number>;

  static registerCustomCard(entry: Omit<CustomCardEntry, "type">) {
    (window as any).customCards = (window as any).customCards || [];
    (window as any).customCards.push({
      preview: true,
      documentationURL: "https://github.com/mymakerofficial/ha-bold-cards",
      type: stripCustomPrefix(this.cardType),
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
  protected abstract _getFeatureInternals(
    context: GetFeatureInternalsContext,
  ): FeatureInternals;

  public setConfig(config: TConfig): void {
    if (!config) {
      throw new Error("Invalid configuration");
    }

    super.setConfig({
      ...config,
      // inject custom internals into features config
      //  this is the only way to pass information and allows features to be more flexible
      features: config.features?.map((feature, featureIndex) => ({
        ...feature,
        __bold_custom_internals: this._getFeatureInternals({
          config,
          feature,
          featureIndex,
          features: config.features ?? [],
        }),
      })),
    });
  }

  protected get _features(): FeatureConfigWithMaybeInternals[] {
    return this._config?.features ?? [];
  }

  protected _getRenderingFeatures(): FeatureConfigWithMaybeInternals[] {
    const features = this._features;
    const stateObj = this._stateObj;

    if (!features.length || !stateObj) {
      return [];
    }

    return features.filter((feature) => {
      return getFeatureDoesRender(feature, stateObj);
    });
  }

  // get the size of all features combined **including** features that do not render
  protected _getTotalFeatureSize() {
    const features = this._features;
    const stateObj = this._stateObj;

    if (!features.length || !stateObj) {
      return 0;
    }

    const size = features.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, stateObj);
      return totalSize + featureSize;
    }, 0);

    return Math.ceil(size);
  }

  // get the size of all features that render combined
  protected _getRenderedFeatureSize() {
    const stateObj = this._stateObj;
    if (!stateObj) {
      return 0;
    }

    const renderingFeatures = this._getRenderingFeatures();
    if (!renderingFeatures.length) {
      return 0;
    }

    const size = renderingFeatures.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, this._stateObj!);
      return totalSize + featureSize;
    }, 0);

    return Math.ceil(size);
  }

  protected abstract _getSizeWithoutFeatures(): number;

  public getCardSize(): number | Promise<number> {
    return this._getSizeWithoutFeatures() + this._getRenderedFeatureSize();
  }

  static registerCustomCard<TConfig = LovelaceCardConfig>(
    entry: Omit<CustomCardEntryWithInternals<TConfig>, "type">,
  ) {
    super.registerCustomCard(entry);

    (window as any).__customCardInternalsMap =
      (window as any).__customCardInternalsMap || new Map();
    (window as any).__customCardInternalsMap.set(this.cardType, {
      getFeatureInternals: entry.getFeatureInternals,
    });
  }
}

export abstract class BoldCardWithInlineFeatures<
  TConfig extends LovelaceCardConfigWithFeatures,
  TStateObj extends HassEntityBase = HassEntityBase,
> extends BoldCardWithFeatures<TConfig, TStateObj> {
  protected abstract _getShouldRenderInlineFeature(): boolean;

  protected get _inlineFeature(): FeatureConfigWithMaybeInternals | undefined {
    return this._getShouldRenderInlineFeature() ? this._features[0] : undefined;
  }

  protected get _bottomFeatures(): FeatureConfigWithMaybeInternals[] {
    return this._getShouldRenderInlineFeature()
      ? // first feature is rendered inline, so skip it
        this._features.slice(1)
      : // no inline feature, so render all
        this._features;
  }

  protected _getRenderingInlineFeatures(): FeatureConfigWithMaybeInternals[] {
    const feature = this._inlineFeature;
    const stateObj = this._stateObj;

    if (!feature || !stateObj) {
      return [];
    }

    if (!getFeatureDoesRender(feature, stateObj)) {
      return [];
    }

    return [feature];
  }

  protected _getRenderingBottomFeatures(): FeatureConfigWithMaybeInternals[] {
    const features = this._bottomFeatures;
    const stateObj = this._stateObj;

    if (!features.length || !stateObj) {
      return [];
    }

    return features.filter((feature) => {
      return getFeatureDoesRender(feature, stateObj);
    });
  }

  // get the size of all features combined **including** features that do not render
  protected _getTotalBottomFeatureSize() {
    const features = this._bottomFeatures;
    const stateObj = this._stateObj;

    if (!features.length || !stateObj) {
      return 0;
    }

    const size = features.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, this._stateObj!);
      return totalSize + featureSize;
    }, 0);

    return Math.ceil(size);
  }

  // get the size of all features that render combined
  protected _getRenderedBottomFeatureSize() {
    const stateObj = this._stateObj;
    if (!stateObj) {
      return 0;
    }

    const features = this._getRenderingBottomFeatures();
    if (!features.length) {
      return 0;
    }

    const size = features.reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, stateObj);
      return totalSize + featureSize;
    }, 0);

    return Math.ceil(size);
  }

  public getCardSize(): number | Promise<number> {
    return (
      this._getSizeWithoutFeatures() + this._getRenderedBottomFeatureSize()
    );
  }
}
