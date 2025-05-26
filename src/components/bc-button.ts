import { customElement, property } from "lit/decorators.js";
import { css, html, nothing, unsafeCSS } from "lit";
import { ControlSurface } from "./bc-contol-surface";

export const ButtonVariant = {
  PLAIN: "plain",
  TONAL: "tonal",
  FILLED: "filled",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonShape = {
  ROUND: "round",
  ROUND_WIDE: "round-wide",
  ROUND_FILL: "round-fill",
  SQUARE: "square",
  SQUARE_WIDE: "square-wide",
  SQUARE_FILL: "square-fill",
} as const;
export type ButtonShape = (typeof ButtonShape)[keyof typeof ButtonShape];

export const ButtonSize = {
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

export function limitButtonSize(
  size: ButtonSize,
  limit: ButtonSize,
): ButtonSize {
  const sizes = Object.values(ButtonSize);
  const sizeIndex = sizes.indexOf(size);
  const limitIndex = sizes.indexOf(limit);
  return sizes[Math.min(sizeIndex, limitIndex)] as ButtonSize;
}

@customElement("bc-button")
export class Button extends ControlSurface {
  @property({ attribute: false }) public iconPath?: string;
  @property({ attribute: false }) public icon?: string;

  @property() variant: ButtonVariant = ButtonVariant.PLAIN;
  @property() shape: ButtonShape = ButtonShape.SQUARE;
  @property() size: ButtonSize = ButtonSize.LG;

  @property({ type: Boolean }) disabled = false;

  protected render() {
    return html`
      <bc-control-surface .disabled=${this.disabled}>
        ${this.iconPath
          ? html`<ha-svg-icon .path=${this.iconPath}></ha-svg-icon>`
          : nothing}
        ${this.icon ? html`<ha-icon .icon=${this.icon}></ha-icon>` : nothing}
        <slot></slot>
      </bc-control-surface>
    `;
  }

  static styles = css`
    :host {
      --button-border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
      --button-color: var(--tile-color, --primary-color);
      --button-background-color: transparent;
      --button-height: 52px;
      --icon-size: 24px;
      --button-width: var(--button-height);
    }

    bc-control-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--button-width);
      height: var(--button-height);
      --control-surface-border-radius: var(--button-border-radius);
      --control-surface-color: var(--button-color);
      --control-surface-background-color: var(--button-background-color);
    }

    :host([size="${unsafeCSS(ButtonSize.SM)}"]) {
      --button-height: 42px;
      --icon-size: 20px;
    }

    :host([size="${unsafeCSS(ButtonSize.LG)}"]) {
      --button-height: 58px;
      --icon-size: 24px;
    }

    :host([size="${unsafeCSS(ButtonSize.XL)}"]) {
      --button-height: 64px;
      --icon-size: 26px;
    }

    :host([shape="${unsafeCSS(ButtonShape.ROUND)}"]) {
      --button-border-radius: calc(var(--button-height) / 2);
    }

    :host([shape="${unsafeCSS(ButtonShape.ROUND_WIDE)}"]) {
      --button-border-radius: calc(var(--button-height) / 2);
      --button-width: calc(var(--button-height) * 2);
    }

    :host([shape="${unsafeCSS(ButtonShape.ROUND_FILL)}"]) {
      --button-border-radius: calc(var(--button-height) / 2);
      flex: 1;
    }

    :host([shape="${unsafeCSS(ButtonShape.SQUARE_WIDE)}"]) {
      --button-width: calc(var(--button-height) * 2);
    }

    :host([shape="${unsafeCSS(ButtonShape.SQUARE_FILL)}"]) {
      flex: 1;
    }

    :host([variant="${unsafeCSS(ButtonVariant.PLAIN)}"]) {
      --button-background-color: transparent;
    }

    :host([variant="${unsafeCSS(ButtonVariant.TONAL)}"]) {
      --button-background-color: rgb(from var(--tile-color) r g b / 20%);
    }

    :host([variant="${unsafeCSS(ButtonVariant.FILLED)}"]) {
      --button-background-color: var(--tile-color);
      --button-color: var(--ha-card-background);
    }

    ha-svg-icon {
      width: var(--icon-size);
      height: var(--icon-size);
      max-height: 80%;
      --mdc-icon-size: 100%;
      transition: transform 180ms ease-in-out;
      pointer-events: none;
    }
  `;
}
