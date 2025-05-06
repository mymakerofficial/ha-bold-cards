import { BoldLovelaceCard } from "../base";
import { EntityCarouselCardConfig } from "./types";
import { html, nothing } from "lit";
import { customElement } from "lit/decorators";
import {
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import {
  firstOf,
  isDefined,
  maxOrUndefined,
  minOrUndefined,
} from "../../lib/helpers";
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
    const entities = this._config?.entities;
    if (
      !this.hass ||
      !entities ||
      entities.length === 0 ||
      !this._config ||
      !this._config.card
    ) {
      return [];
    }

    const cards = this.dedupeMediaPlayerEntities(entities)
      .filter((entityId) => this.isStateActiveByEntityId(entityId))
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
