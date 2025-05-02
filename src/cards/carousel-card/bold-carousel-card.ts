import { BoldLovelaceCard } from "../base";
import { CarouselCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import {
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { isDefined, maxOrUndefined, minOrUndefined } from "../../lib/helpers";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { enrichCarouselCardConfig } from "./helpers";
import { getCardEditorTag } from "../../lib/cards/helpers";

const cardType = BoldCardType.CAROUSEL;

@customElement(stripCustomPrefix(cardType))
export class BoldCarouselCard extends BoldLovelaceCard<CarouselCardConfig> {
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

    const grids = this._config.cards
      .map((card) =>
        this.getCardGridOptions(
          enrichCarouselCardConfig({ config: this._config!, entry: card }),
        ),
      )
      .filter(isDefined);

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

  protected render() {
    const config = this._config;
    if (!config || !this.hass) {
      return nothing;
    }

    const cards = config.cards.map((entry) =>
      enrichCarouselCardConfig({ config, entry }),
    );

    return html`
      <bc-carousel
        .length=${cards.length}
        .getElement=${(index: number) => html`
          <hui-card .config=${cards[index]} .hass=${this.hass}></hui-card>
        `}
        .getKey=${(index: number) => Object.entries(cards[index]).flat().join()}
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
  description: "A carousel of cards.",
  preview: false,
});
