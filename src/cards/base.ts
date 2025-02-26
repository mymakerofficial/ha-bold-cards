import { LitElement } from "lit";
import { HomeAssistant, LovelaceCard } from "../types/ha/lovelace";
import { property, query, queryAll, state } from "lit/decorators";
import { LovelaceCardConfigWithFeatures } from "../types/card";
import { isCustomFeatureElement } from "../features/base";

export abstract class CustomLovelaceCard<
    TConfig extends LovelaceCardConfigWithFeatures,
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

  @query("hui-card-features")
  private _featuresContainer?: LitElement;

  protected _getFeatureElements() {
    const featuresCollection =
      this._featuresContainer?.shadowRoot?.querySelector(
        ".container",
      )?.children;
    if (!featuresCollection) {
      console.log("_getFeatureElements", "no featuresCollection");
      return [];
    }
    const res = Array.from(featuresCollection).map(
      (featureContainer) => featureContainer.shadowRoot?.children[0]!,
    );
    console.log("_getFeatureElements", res);
    return res;
  }

  protected _getFeatureTotalSize() {
    const res = this._getFeatureElements().reduce((totalSize, element) => {
      if (isCustomFeatureElement(element)) {
        return totalSize + element.getFeatureSize();
      }
      return totalSize + 1;
    }, 0);
    console.log("_getFeatureTotalSize", res);
    return res;
  }

  abstract getCardSize(): number | Promise<number>;
}
