import { BoldLovelaceCard } from "../base";
import { MultiCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { customElement, state } from "lit/decorators";
import { LovelaceCardEditor } from "../../types/ha/lovelace";
import { styleMap } from "lit-html/directives/style-map";
import { createRef, ref } from "lit-html/directives/ref";
import { classMap } from "lit-html/directives/class-map";

@customElement("bold-multi-card")
export class BoldMultiCard extends BoldLovelaceCard<MultiCardConfig> {
  private _containerRef = createRef();
  @state() private _containerWidth: number = 0;
  @state() private _containerScrollLeft: number = 0;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/multi-card/bold-multi-card-editor");
    return document.createElement(
      "bold-multi-card-editor",
    ) as LovelaceCardEditor;
  }

  public getCardSize(): number {
    return 1;
  }

  protected firstUpdated() {
    this._containerRef.value?.addEventListener(
      "scroll",
      this._onScroll.bind(this),
    );
    this._containerRef.value?.addEventListener(
      "resize",
      this._updateContainerWidth.bind(this),
    );
    this._updateContainerWidth();
  }

  private _onScroll() {
    this._containerScrollLeft = this._containerRef.value?.scrollLeft || 0;
  }

  private _updateContainerWidth() {
    this._containerWidth = this._containerRef.value?.clientWidth || 0;
  }

  private get _scrollIndex() {
    return this._containerScrollLeft / this._containerWidth;
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
      <div
        class="container"
        style="${styleMap({
          "--left-snap-distance": Math.min(
            Math.abs(this._scrollIndex - Math.floor(this._scrollIndex)),
            1,
          ),
          "--right-snap-distance": Math.min(
            Math.abs(this._scrollIndex - Math.ceil(this._scrollIndex)),
            1,
          ),
        })}}"
        ${ref(this._containerRef)}
      >
        ${repeat(
          cards,
          (card, index) => html`
            <div
              class="item"
              data-direction=${index <= this._scrollIndex ? "left" : "right"}
              style=${styleMap({
                "--snap-distance": Math.min(
                  Math.abs(this._scrollIndex - index),
                  1,
                ),
              })}
            >
              <div class="inner">
                <hui-card .config=${card} .hass=${this.hass}></hui-card>
              </div>
            </div>
          `,
        )}
      </div>
      <div class="stepper-container">
        <div class="stepper">
          ${repeat(
            cards,
            (_, index) => html`
              <div
                class="step"
                data-active=${index === Math.round(this._scrollIndex)}
                @click=${() => {
                  this._containerRef.value?.scrollTo({
                    left: this._containerWidth * index,
                    behavior: "smooth",
                  });
                }}
              ></div>
            `,
          )}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-snap-points-x: repeat(100%);
        scroll-padding-block: 8px;
        --left-border-radius: calc(
          var(--border-radius, 4px) * (1 - var(--left-snap-distance) / 2)
        );
        --right-border-radius: calc(
          var(--border-radius, 4px) * (1 - var(--right-snap-distance) / 2)
        );
        border-radius: var(--left-border-radius) var(--right-border-radius)
          var(--right-border-radius) var(--left-border-radius);
      }

      /* disable scrollbar */
      .container::-webkit-scrollbar {
        display: none;
      }

      .container::-webkit-scrollbar-thumb {
        display: none;
      }

      .container::-webkit-scrollbar-track {
        display: none;
      }

      .item {
        scroll-snap-align: start;
        display: flex;
        align-items: center;
        justify-content: inherit;
        overflow: hidden;
        height: 100%;
        min-width: 100%;
      }

      .inner {
        position: relative;
        overflow: hidden;
        height: 100%;
        min-width: 100%;
        --ha-card-border-radius: calc(
          var(--border-radius, 4px) * (1 - var(--snap-distance) / 2)
        );
        border-radius: var(--ha-card-border-radius);
        background: var(
          --card-background-color,
          var(--paper-card-background-color)
        );
        opacity: calc(1 - pow(var(--snap-distance), 3));
      }

      hui-card {
        height: 100%;
        min-width: 100%;
        position: absolute;
        opacity: calc(1 - var(--snap-distance));
      }

      .item[data-direction="left"] hui-card {
        left: calc(100% * var(--snap-distance) / 2);
      }

      .item[data-direction="right"] hui-card {
        right: calc(100% * var(--snap-distance) / 2);
      }

      .stepper-container {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
      }

      .stepper {
        display: flex;
        gap: 8px;
      }

      .step {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--primary-text-color);
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .step[data-active="true"] {
        opacity: 1;
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
