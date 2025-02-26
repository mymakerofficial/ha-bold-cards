import { LitElement } from "lit";
import { HomeAssistant, LovelaceCard } from "../types/ha/lovelace";
import { property, state } from "lit/decorators";
import { LovelaceCardConfigWithFeatures } from "../types/card";

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

  abstract getCardSize(): number | Promise<number>;
}
