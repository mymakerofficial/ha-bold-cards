import { customElement, property } from "lit/decorators";
import { css, html } from "lit";
import { ControlSurface } from "./mpt-contol-surface";

export const ButtonVariant = {
  PLAIN: "plain",
  TONAL: "tonal",
  FILLED: "filled",
} as const;
export type ButtonVariant = (typeof ButtonVariant)[keyof typeof ButtonVariant];

export const ButtonShape = {
  ROUNDED: "rounded",
  SQUARE: "square",
  WIDE: "wide",
} as const;
export type ButtonShape = (typeof ButtonShape)[keyof typeof ButtonShape];

export const ButtonSize = {
  SM: "sm",
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

@customElement("mpt-button")
export class Button extends ControlSurface {
  @property({ attribute: false }) public iconPath?: string;

  @property() variant: ButtonVariant = ButtonVariant.PLAIN;
  @property() shape: ButtonShape = ButtonShape.SQUARE;
  @property() size: ButtonSize = ButtonSize.LG;

  protected render() {
    return html`
      <mpt-control-surface .disabled=${this.disabled}>
        <ha-svg-icon .path=${this.iconPath}></ha-svg-icon>
        <slot></slot>
      </mpt-control-surface>
    `;
  }

  static styles = css`
    :host {
      --button-border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
      --button-color: var(--tile-color, --primary-color);
      --button-background-color: transparent;
      --button-height: 53px;
      --icon-size: 24px;
      --button-width: var(--button-height);
    }

    mpt-control-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--button-width);
      height: var(--button-height);
      --control-surface-border-radius: var(--button-border-radius);
      --control-surface-color: var(--button-color);
      --control-surface-background-color: var(--button-background-color);
    }

    :host([size="sm"]) {
      --button-height: 42px;
      --icon-size: 20px;
    }

    :host([size="lg"]) {
      --button-height: 53px;
      --icon-size: 24px;
    }

    :host([size="xl"]) {
      --button-height: 64px;
      --icon-size: 26px;
    }

    :host([shape="rounded"]) {
      --button-border-radius: 32px;
    }

    :host([shape="wide"]) {
      --button-width: calc(var(--button-height) * 2);
    }

    :host([variant="plain"]) {
      --button-background-color: transparent;
    }

    :host([variant="tonal"]) {
      --button-background-color: rgb(from var(--tile-color) r g b / 20%);
    }

    :host([variant="filled"]) {
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
