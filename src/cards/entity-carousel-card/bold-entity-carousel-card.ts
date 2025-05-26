import { EntityCarouselCardConfig } from "./types";
import { customElement } from "lit/decorators.js";
import { LovelaceCardEditor } from "../../types/ha/lovelace";
import { firstOf } from "../../lib/helpers";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { getEntityCarouselCardConfig } from "./helpers";
import { getCardEditorTag } from "../../lib/cards/helpers";
import { BoldCarouselCardBase } from "../carousel-card/base";

const cardType = BoldCardType.ENTITY_CAROUSEL;

@customElement(stripCustomPrefix(cardType))
export class BoldEntityCarouselCard extends BoldCarouselCardBase<EntityCarouselCardConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(
      "../../editors/cards/entity-carousel-card/bold-entity-carousel-card-editor"
    );
    return document.createElement(
      getCardEditorTag(cardType),
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  static getStubConfig(): EntityCarouselCardConfig {
    return {
      type: this.cardType,
      entities: [],
      card: undefined,
    };
  }

  protected toCardWithEntity(entity: string) {
    return getEntityCarouselCardConfig({
      config: this._config!,
      entity,
    });
  }

  protected _getCards() {
    if (!this.hass) {
      return [];
    }
    const config = this._config;
    if (!config) {
      return [];
    }
    const entities = this._config?.entities;
    if (!entities || entities.length === 0) {
      return [];
    }

    const cards = this.dedupeMediaPlayerEntities(entities)
      .filter(
        (entityId) =>
          !config.remove_inactive_entities ||
          this.isStateActiveByEntityId(entityId),
      )
      .map((entityId) => this.toCardWithEntity(entityId));

    if (cards.length >= 1) {
      return cards;
    }

    return [this.toCardWithEntity(firstOf(entities)!)];
  }
}

BoldEntityCarouselCard.registerCustomCard({
  name: "Bold Entity Carousel",
  description: "Turn any card into a carousel with multiple entities.",
  preview: false,
});
