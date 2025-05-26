import { customElement } from "lit/decorators.js";
import { css, html, nothing } from "lit";
import { BoldFeatureStackFeatureConfig } from "./types";
import { CustomLovelaceCardFeature } from "../base";
import { HassEntity } from "home-assistant-js-websocket";
import { styleMap } from "lit-html/directives/style-map.js";
import { getFeatureDoesRender, getFeatureSize } from "../size";
import {
  FeatureConfigWithMaybeInternals,
  FeatureInternals,
} from "../../lib/internals/types";
import { LovelaceCardFeatureEditor } from "../../types/ha/lovelace";
import { BoldFeatureType } from "../../lib/features/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { GetFeatureInternalsContext } from "../../types/card";

const featureType = BoldFeatureType.FEATURE_STACK;

function getFeatureInternals(
  context: GetFeatureInternalsContext<
    FeatureConfigWithMaybeInternals<BoldFeatureStackFeatureConfig>
  >,
): FeatureInternals {
  return {
    ...(context.config?.__bold_custom_internals ?? {}),
    parent_feature_type: featureType,
    is_inlined: false,
    is_first: context.featureIndex === 0,
    is_last: context.featureIndex === context.features.length - 1,
  };
}

// TODO duplication from base card with features, should be shared
function getFeatureHeight(
  config: FeatureConfigWithMaybeInternals<BoldFeatureStackFeatureConfig>,
  stateObj: HassEntity,
) {
  if (!config.features || !config.features.length) {
    return 0;
  }

  const size = config.features
    .map((feature, index) => ({
      ...feature,
      __bold_custom_internals: getFeatureInternals({
        config,
        feature,
        featureIndex: index,
        features: config.features ?? [],
      }),
    }))
    .filter((feature) => {
      return getFeatureDoesRender(feature, stateObj);
    })
    .reduce((totalSize, feature) => {
      const featureSize = getFeatureSize(feature, stateObj);
      return totalSize + featureSize;
    }, 0);

  return Math.ceil(size);
}

@customElement(stripCustomPrefix(featureType))
export class BoldFeatureStackFeature extends CustomLovelaceCardFeature<
  HassEntity,
  BoldFeatureStackFeatureConfig
> {
  public static async getConfigElement(): Promise<LovelaceCardFeatureEditor> {
    await import(
      "../../editors/features/feature-stack-feature/bold-feature-stack-feature-editor"
    );
    return document.createElement(
      "bold-feature-stack-feature-editor",
    ) as LovelaceCardFeatureEditor;
  }

  static get featureType() {
    return featureType;
  }

  static getStubConfig(): BoldFeatureStackFeatureConfig {
    return {
      type: this.featureType,
    };
  }

  render() {
    const config = this._config;
    const stateObj = this.stateObj;

    if (!config || !config.features || !this.hass || !stateObj) {
      return nothing;
    }

    if (!this.getDoesRender()) {
      return nothing;
    }

    const features = config.features
      .map((feature, index) => ({
        ...feature,
        // TODO how to tell the feature that it is inside a stack?
        __bold_custom_internals: getFeatureInternals({
          config,
          feature,
          featureIndex: index,
          features: config.features ?? [],
        }),
      }))
      .filter((feature) => {
        return getFeatureDoesRender(feature, stateObj);
      });

    return html`
      <hui-card-features
        .hass=${this.hass}
        .stateObj=${stateObj}
        .features=${features}
        style=${styleMap({
          "--feature-height":
            "calc(var(--row-height) + var(--row-gap) - var(--card-padding))",
          "--feature-gap": "var(--card-padding)",
          gap: "0",
        })}
      ></hui-card-features>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: color-mix(
          in srgb,
          var(--ha-card-background),
          var(--lovelace-background) 80%
        );
        border-radius: calc(
          var(--ha-card-border-radius, 12px) - var(--feature-gap) / 2
        );
      }
    `;
  }
}

BoldFeatureStackFeature.registerCustomFeature<
  HassEntity,
  BoldFeatureStackFeatureConfig
>({
  name: "Feature Stack",
  getSize: getFeatureHeight,
  configurable: true,
});
