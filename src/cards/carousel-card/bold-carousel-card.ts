import { BoldLovelaceCard } from "../base";
import { CarouselCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { customElement, state } from "lit/decorators";
import { HomeAssistant, LovelaceCardEditor } from "../../types/ha/lovelace";
import { createRef, ref } from "lit-html/directives/ref";
import { firstOf } from "../../lib/helpers";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldMediaPlayerCard } from "../media-player-card/bold-media-player-card";

const cardType = BoldCardType.CAROUSEL;

@customElement(stripCustomPrefix(cardType))
export class BoldCarouselCard extends BoldLovelaceCard<CarouselCardConfig> {
  private _containerRef = createRef();
  @state() private _containerWidth: number = 0;
  @state() private _activeIndex: number = 0;
  @state() private _nextIndex: number = 0;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/carousel-card/bold-carousel-card-editor");
    return document.createElement(
      "bold-carousel-card-editor",
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  static getStubConfig(hass: HomeAssistant): CarouselCardConfig {
    const { entity, ...stubCard } = BoldMediaPlayerCard.getStubConfig(hass);
    return {
      type: this.cardType,
      entities: [entity],
      card: stubCard,
    };
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

  private _handleClickStep(index: number, instant: boolean = false) {
    this._containerRef.value?.scrollTo({
      left: this._containerWidth * index,
      behavior: instant ? "auto" : "smooth",
    });
  }

  private _handleStepperKeyDown(ev: KeyboardEvent) {
    ev.stopPropagation();

    const length = this._config!.entities.length;

    if (ev.key === "ArrowRight") {
      const nextIndex = (this._activeIndex + 1) % length;
      const distance = Math.abs(nextIndex - this._activeIndex);
      this._handleClickStep(nextIndex, distance > 1);
    } else if (ev.key === "ArrowLeft") {
      const nextIndex = (this._activeIndex - 1 + length) % length;
      const distance = Math.abs(nextIndex - this._activeIndex);
      this._handleClickStep(nextIndex, distance > 1);
    }
  }

  protected toCardWithEntity(entity: string) {
    return {
      ...this._config!.card,
      entity,
    };
  }

  protected getCards() {
    const entities = this._config?.entities;
    if (!this.hass || !entities || entities.length === 0) {
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
      ${cards.length > 1
        ? html`
            <div class="stepper-container">
              <div
                class="stepper"
                tabindex="0"
                role="tablist"
                @keydown=${this._handleStepperKeyDown}
              >
                ${repeat(
                  cards,
                  (_, index) => html`
                    <div
                      class="step"
                      role="tab"
                      aria-selected=${index === this._activeIndex}
                      @click=${() => this._handleClickStep(index)}
                    >
                      <div class="step-inner" />
                    </div>
                  `,
                )}
              </div>
            </div>
          `
        : nothing}
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
        z-index: 100;
      }

      .stepper {
        display: flex;
        gap: 8px;
      }

      .stepper:focus-visible {
        outline: none;
      }

      .step {
        cursor: pointer;
        margin: -4px;
        padding: 4px;
        transition: scale 180ms linear;
      }

      .step[aria-selected="true"] {
        scale: 1.1;
      }

      .step:hover {
        scale: 1.2;
      }

      .step-inner {
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background: var(--primary-text-color);
        opacity: 0.5;
        transition: opacity 180ms linear;
      }

      .step[aria-selected="true"] .step-inner {
        opacity: 1;
      }

      .stepper:focus-visible .step[aria-selected="true"] .step-inner {
        outline: 2px solid var(--primary-text-color);
        outline-offset: 2px;
      }
    `;
  }
}

BoldCarouselCard.registerCustomCard({
  name: "Bold Carousel",
  description: "Turn any card into a carousel with multiple entities.",
  preview: true,
});
