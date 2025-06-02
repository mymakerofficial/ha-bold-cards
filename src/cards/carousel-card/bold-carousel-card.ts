import { CarouselCardConfig } from "./types";
import { customElement } from "lit/decorators";
import { LovelaceCardEditor } from "../../types/ha/lovelace";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { enrichCarouselCardConfig } from "./helpers";
import { getCardEditorTag } from "../../lib/cards/helpers";
import { BoldCarouselCardBase } from "./base";

const cardType = BoldCardType.CAROUSEL;

@customElement(stripCustomPrefix(cardType))
export class BoldCarouselCard extends BoldCarouselCardBase<CarouselCardConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/carousel-card/bold-carousel-card-editor");
    return document.createElement(
      getCardEditorTag(cardType),
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  static getStubConfig(): CarouselCardConfig {
    return {
      type: this.cardType,
      cards: [],
    };
  }

  protected _getCards() {
    const config = this._config;
    if (!config) {
      return [];
    }

    return config.cards.map((entry) =>
      enrichCarouselCardConfig({ config, entry }),
    );
  }
}

BoldCarouselCard.registerCustomCard({
  name: "Bold Carousel",
  description: "A carousel of cards.",
  preview: false,
});
