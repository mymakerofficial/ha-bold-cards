import { BoldLovelaceCard } from "../base";
import { CarouselCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { HomeAssistant, LovelaceCardEditor } from "../../types/ha/lovelace";
import { firstOf } from "../../lib/helpers";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldMediaPlayerCard } from "../media-player-card/bold-media-player-card";

const cardType = BoldCardType.CAROUSEL;

@customElement(stripCustomPrefix(cardType))
export class BoldCarouselCard extends BoldLovelaceCard<CarouselCardConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/carousel-card/bold-carousel-card-editor");
    return document.createElement(
      "bold-carousel-card-editor",
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  static getStubConfig(): CarouselCardConfig {
    return {
      type: this.cardType,
      entities: [],
      card: undefined,
    };
  }

  public getCardSize(): number {
    return 1;
  }

  protected toCardWithEntity(entity: string) {
    return {
      ...this._config!.card,
      entity,
    };
  }

  protected getCards() {
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

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const cards = this.getCards();

    return html`
      <bc-carousel
        .length=${cards.length}
        .getElement=${(index: number) => html`
          <hui-card .config=${cards[index]} .hass=${this.hass}></hui-card>
        `}
        .getKey=${(index: number) => cards[index].entity}
      />
    `;
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        width: 100%;
        height: 100%;
      }

      hui-card {
        height: 100%;
        min-width: 100%;
        width: 100%;
        position: absolute;
      }
    `;
  }
}

BoldCarouselCard.registerCustomCard({
  name: "Bold Carousel",
  description: "Turn any card into a carousel with multiple entities.",
  preview: false,
});
