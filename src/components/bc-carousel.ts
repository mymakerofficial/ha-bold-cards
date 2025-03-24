import { html, nothing, TemplateResult } from "lit-element";
import { createRef, ref } from "lit-html/directives/ref";
import { repeat } from "lit-html/directives/repeat";
import { customElement, property, state } from "lit/decorators";
import { LitElement, css, unsafeCSS } from "lit";
import { PropertyValues } from "@lit/reactive-element";

export const CarouselStepperPosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type CarouselStepperPosition =
  (typeof CarouselStepperPosition)[keyof typeof CarouselStepperPosition];

@customElement("bc-carousel")
export class BcCarousel extends LitElement {
  @property({ attribute: false }) public getElement?: (
    index: number,
  ) => TemplateResult;
  @property({ attribute: false }) public getKey: (index: number) => string = (
    index,
  ) => index.toString();
  @property({ attribute: false }) public length: number = 0;
  @property() public position: CarouselStepperPosition =
    CarouselStepperPosition.CENTER;

  private _containerRef = createRef();

  @state() private _containerWidth: number = 0;
  @state() private _activeIndex: number = 0;
  @state() private _nextIndex: number = 0;
  @state() private _isScrolling: boolean = false;

  private _scrollProgress: number = 0;

  private _scrollTimeout?: number;

  public connectedCallback() {
    super.connectedCallback();
    this._mount();
  }

  public firstUpdated() {
    this._mount();
  }

  private _mount() {
    this._updateContainerWidth();
    this._containerRef.value?.addEventListener(
      "scroll",
      this._onScroll.bind(this),
    );
    this._containerRef.value?.addEventListener(
      "resize",
      this._updateContainerWidth.bind(this),
    );
  }

  private _onScroll() {
    const gap = 16;

    this._isScrolling = true;
    this._scrollTimeout && clearTimeout(this._scrollTimeout);
    this._scrollTimeout = setTimeout(() => {
      const percentDiff = Math.abs(
        Math.round(this._scrollProgress) - this._scrollProgress,
      );
      const onePixelInPercent =
        1 / ((this._containerWidth + gap) * this.length);
      if (percentDiff > onePixelInPercent * gap) {
        return;
      }
      this._isScrolling = false;
    }, 100) as unknown as number;

    const scrollLeft = this._containerRef.value?.scrollLeft || 0;
    const scrollProgress = scrollLeft / (this._containerWidth + gap);
    this._scrollProgress = scrollProgress;

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
    const newContainerWidth =
      this._containerRef.value?.children[0]?.getBoundingClientRect().width ||
      this._containerRef.value?.clientWidth ||
      0;
    if (this._containerWidth === newContainerWidth) {
      return;
    }
    this._containerWidth = newContainerWidth;
    this._onScroll();
  }

  public willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has("_isScrolling") ||
      changedProperties.has("_activeIndex")
    ) {
      this._updateContainerWidth();
    }
  }

  private _handleClickStep(index: number, instant: boolean = false) {
    this._containerRef.value?.scrollTo({
      left: this._containerWidth * index,
      behavior: instant ? "auto" : "smooth",
    });
  }

  private _handleStepperKeyDown(ev: KeyboardEvent) {
    ev.stopPropagation();

    if (ev.key === "ArrowRight") {
      const nextIndex = (this._activeIndex + 1) % this.length;
      const distance = Math.abs(nextIndex - this._activeIndex);
      this._handleClickStep(nextIndex, distance > 1);
    } else if (ev.key === "ArrowLeft") {
      const nextIndex = (this._activeIndex - 1 + this.length) % this.length;
      const distance = Math.abs(nextIndex - this._activeIndex);
      this._handleClickStep(nextIndex, distance > 1);
    }
  }

  protected render() {
    return html`
      <div class="carousel" data-is-scrolling=${this._isScrolling}>
        ${this.length > 1
          ? html`
              <div class="stepper-container" data-position=${this.position}>
                <div
                  class="stepper"
                  tabindex="0"
                  role="tablist"
                  @keydown=${this._handleStepperKeyDown}
                >
                  ${repeat(
                    Array.from({ length: this.length }),
                    (_, index) => this.getKey(index),
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
        <div class="scroll-container" ${ref(this._containerRef)}>
          ${repeat(
            Array.from({ length: this.length }),
            (_, index) => this.getKey(index),
            (_, index) => html`
              <div class="item">
                <div class="inner">
                  ${index === this._activeIndex ||
                  (index === this._nextIndex && this._isScrolling)
                    ? this.getElement?.(index)
                    : nothing}
                </div>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        --carousel-overflow-space: 8px;
        --stepper-y-offset: 4px;
        --stepper-x-offset: 4px;
      }

      .carousel {
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      .carousel[data-is-scrolling="true"] {
        --carousel-overflow-space: 0px;
      }

      .scroll-container {
        position: relative;
        width: calc(100% + var(--carousel-overflow-space) * 2);
        height: calc(100% + var(--carousel-overflow-space) * 2);
        display: flex;
        gap: calc(16px - var(--carousel-overflow-space) * 2);
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scroll-snap-align: center;
        scroll-padding: 8px 0;
        left: calc(var(--carousel-overflow-space) * -1);
        top: calc(var(--carousel-overflow-space) * -1);
      }

      .carousel[data-is-scrolling="true"] .scroll-container {
        border-radius: var(--ha-card-border-radius);
      }

      /* disable scrollbar */
      .scroll-container::-webkit-scrollbar {
        display: none;
      }

      .scroll-container::-webkit-scrollbar-thumb {
        display: none;
      }

      .scroll-container::-webkit-scrollbar-track {
        display: none;
      }

      .item {
        scroll-snap-align: center;
        display: flex;
        align-items: center;
        justify-content: inherit;
        height: calc(100% - var(--carousel-overflow-space) * 2);
        min-width: calc(100% - var(--carousel-overflow-space) * 2);
        padding: var(--carousel-overflow-space);
      }

      .inner {
        position: relative;
        height: 100%;
        min-width: 100%;
        display: block;
      }

      .stepper-container {
        position: absolute;
        bottom: var(--stepper-y-offset);
        display: flex;
        gap: 8px;
        z-index: 1;
      }

      .stepper-container[data-position="${unsafeCSS(
          CarouselStepperPosition.LEFT,
        )}"] {
        left: var(--stepper-x-offset);
      }

      .stepper-container[data-position="${unsafeCSS(
          CarouselStepperPosition.CENTER,
        )}"] {
        left: 50%;
        transform: translateX(-50%);
      }

      .stepper-container[data-position="${unsafeCSS(
          CarouselStepperPosition.RIGHT,
        )}"] {
        left: auto;
        right: var(--stepper-x-offset);
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
