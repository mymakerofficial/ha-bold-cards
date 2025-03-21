import { html, nothing, TemplateResult } from "lit-element";
import { createRef, ref } from "lit-html/directives/ref";
import { repeat } from "lit-html/directives/repeat";
import { customElement, property, state } from "lit/decorators";
import { LitElement, css, unsafeCSS } from "lit";

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
    const scrollLeft = this._containerRef.value?.scrollLeft || 0;
    const scrollProgress = scrollLeft / this._containerWidth;

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
      <div class="container" ${ref(this._containerRef)}>
        ${repeat(
          Array.from({ length: this.length }),
          (_, index) => this.getKey(index),
          (_, index) => html`
            <div class="item">
              <div class="inner">
                ${index === this._activeIndex || index === this._nextIndex
                  ? this.getElement?.(index)
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
        display: block;
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
      }

      .stepper-container {
        position: absolute;
        bottom: 8px;
        display: flex;
        gap: 8px;
        z-index: 1;
      }

      .stepper-container[data-position="${unsafeCSS(
          CarouselStepperPosition.LEFT,
        )}"] {
        left: 8px;
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
        right: 8px;
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
