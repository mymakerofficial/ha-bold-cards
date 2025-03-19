import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldFeatureStackFeatureConfig } from "./types";
import { CustomLovelaceCardFeature } from "../base";
import { HassEntity } from "home-assistant-js-websocket";
import { styleMap } from "lit-html/directives/style-map";
import { getFeatureDoesRender, getFeatureSize } from "../size";
import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";
import { LovelaceCardFeatureEditor } from "../../types/ha/lovelace";
import { BoldFeatureType } from "../../lib/features/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";

// TODO duplication from base card with features, should be shared
function getFeatureHeight(
  config: FeatureConfigWithMaybeInternals<BoldFeatureStackFeatureConfig>,
  stateObj: HassEntity,
) {
  if (!config.features || !config.features.length) {
    return 0;
  }

  const size = config.features
    .map((feature) => ({
      ...feature,
      __bold_custom_internals: config.__bold_custom_internals,
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

const featureType = BoldFeatureType.FEATURE_STACK;

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

    if (!config || !config.features || !this.hass || !this.stateObj) {
      return nothing;
    }

    const features = config.features.map((feature) => ({
      ...feature,
      // TODO how to tell the feature that it is inside a stack?
      __bold_custom_internals: config.__bold_custom_internals,
    }));

    return html`
      <hui-card-features
        .hass=${this.hass}
        .stateObj=${this.stateObj}
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
