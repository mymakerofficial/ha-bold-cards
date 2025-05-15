import { BoldLovelaceCard } from "../base";
import { CarouselCardBaseConfig } from "./types";
import {
  LovelaceCardConfig,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { Position } from "../../lib/layout/position";
import { isDefined, maxOrUndefined, minOrUndefined } from "../../lib/helpers";
import { css, html, nothing } from "lit";

export abstract class BoldCarouselCardBase<
  TConfig extends CarouselCardBaseConfig,
> extends BoldLovelaceCard<TConfig> {
  public setConfig(config: TConfig) {
    super.setConfig({
      stepper_position: Position.BOTTOM_CENTER,
      ...config,
    });
  }

  protected abstract _getCards(): LovelaceCardConfig[];

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions(): LovelaceGridOptions {
    const config = this._config;
    if (!config || !this.hass) {
      return {
        columns: 1,
        rows: "auto",
      };
    }

    const grids = this._getCards()
      .map((card) => this.getCardGridOptions(card).getOrUndefined())
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

    const cards = this._getCards();

    return html`
      <bc-carousel
        .length=${cards.length}
        .getElement=${(index: number) => html`
          <hui-card .config=${cards[index]} .hass=${this.hass}></hui-card>
        `}
        .getKey=${(index: number) => Object.entries(cards[index]).flat().join()}
        .stepperPosition=${config.stepper_position}
        .stepperStyle=${config.stepper_style}
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

      bc-carousel {
        --stepper-x-offset: max(
          calc(var(--ha-card-border-radius, 12px) / 1.5),
          4px
        );
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
