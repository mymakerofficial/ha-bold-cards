import { BoldLovelaceCard } from "../base";
import { MultiCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { customElement } from "lit/decorators";
import { LovelaceCardEditor } from "../../types/ha/lovelace";

@customElement("bold-multi-card")
export class BoldMultiCard extends BoldLovelaceCard<MultiCardConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/multi-card/bold-multi-card-editor");
    return document.createElement(
      "bold-multi-card-editor",
    ) as LovelaceCardEditor;
  }

  public getCardSize(): number {
    return 1;
  }

  protected render() {
    if (!this._config) {
      return nothing;
    }

    const cards = this._config.entities.map((entity) => ({
      entity,
      ...this._config!.card,
    }));

    return html`
      ${repeat(
        cards,
        (card) =>
          html`<hui-card .config=${card} .hass=${this.hass}></hui-card>`,
      )}
    `;
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-snap-points-x: repeat(100%);
        scroll-padding-block: 8px;
        border-radius: var(--ha-card-border-radius, 4px);
      }

      hui-card {
        scroll-snap-align: start;
        min-width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `;
  }
}

BoldMultiCard.registerCustomCard({
  type: "bold-multi-card",
  name: "Bold Multi Card",
  description: "A card that allows you to display multiple cards in one.",
  preview: true,
});
