import { BoldLovelaceCard } from "../base";
import { CarouselCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { customElement, query } from "lit/decorators";
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
import { getCarouselCardConfig } from "./helpers";

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

  public getGridOptions(): LovelaceGridOptions {
    if (!this._config || !this.hass) {
      return {
        columns: 1,
        rows: "auto",
      };
    }

    const grids = this._config!.entities.map((entity) =>
      this.getCardGridOptions(
        getCarouselCardConfig({ config: this._config!, entity }),
      ),
    ).filter(isDefined);

    const columns = grids.map((grid) => grid.columns).filter(isDefined);
    const rows = grids.map((grid) => grid.rows).filter(isDefined);
    const max_columns = grids.map((grid) => grid.max_columns).filter(isDefined);
    const min_columns = grids.map((grid) => grid.min_columns).filter(isDefined);
    const min_rows = grids.map((grid) => grid.min_rows).filter(isDefined);
    const max_rows = grids.map((grid) => grid.max_rows).filter(isDefined);

    return {
      columns: columns.includes("full")
        ? "full"
        : minOrUndefined(columns as number[]),
      rows: rows.includes("auto") ? "auto" : minOrUndefined(rows as number[]),
      max_columns: minOrUndefined(max_columns),
      min_columns: maxOrUndefined(min_columns),
      min_rows: maxOrUndefined(min_rows),
      max_rows: minOrUndefined(max_rows),
    };
  }

  protected toCardWithEntity(entity: string) {
    return getCarouselCardConfig({
      config: this._config!,
      entity,
    });
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
