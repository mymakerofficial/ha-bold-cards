import { BoldLovelaceCard } from "../base";
import { MultiCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { customElement, state } from "lit/decorators";
import { LovelaceCardEditor } from "../../types/ha/lovelace";
import { createRef, ref } from "lit-html/directives/ref";

@customElement("bold-multi-card")
export class BoldMultiCard extends BoldLovelaceCard<MultiCardConfig> {
  private _containerRef = createRef();
  @state() private _containerWidth: number = 0;
  @state() private _activeIndex: number = 0;
  @state() private _nextIndex: number = 0;

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
    const scrollLeft = this._containerRef.value?.scrollLeft || 0;
    const scrollProgress =
      Math.round((scrollLeft / this._containerWidth) * 10) / 10;

    const newIndex = Math.round(scrollProgress);
    if (this._activeIndex !== newIndex) {
      this._activeIndex = newIndex;
    }

    const newNextIndex =
      scrollProgress > newIndex
        ? newIndex + 1
        : scrollProgress < newIndex
          ? newIndex - 1
          : newIndex;

    if (this._nextIndex !== newNextIndex) {
      this._nextIndex = newNextIndex;
    }
  }

  private _updateContainerWidth() {
    this._containerWidth = this._containerRef.value?.clientWidth || 0;
    this._onScroll();
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
      <div class="container" ${ref(this._containerRef)}>
        ${repeat(
          cards,
          (card, index) => html`
            <div class="item">
              <div class="inner">
                ${index === this._activeIndex || index === this._nextIndex
                  ? html`
                      <hui-card
                        aria-disabled=${index !== this._activeIndex}
                        .config=${card}
                        .hass=${this.hass}
                      ></hui-card>
                    `
                  : nothing}
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
                data-active=${index === this._activeIndex}
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
        gap: 16px;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-snap-points-x: repeat(100%);
        scroll-padding-block: 8px;
        border-radius: var(--ha-card-border-radius);
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
        border-radius: var(--ha-card-border-radius);
        background: var(
          --card-background-color,
          var(--paper-card-background-color)
        );
      }

      hui-card {
        height: 100%;
        min-width: 100%;
        width: 100%;
        position: absolute;
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
        border-radius: 6px;
        background: var(--primary-text-color);
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 180ms linear;
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
