import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";
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
  @property() size: ButtonSize = ButtonSize.MD;

  protected render() {
    return html`
      <mpt-control-surface .disabled=${this.disabled}>
        <ha-svg-icon .path=${this.iconPath}></ha-svg-icon>
        <slot></slot>
      </mpt-control-surface>
    `;
  }

  static styles = css`
    mpt-control-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      --control-surface-border-radius: calc(
        var(--ha-card-border-radius, 12px) / 2
      );
      min-width: 53px;
      height: 53px;
      --icon-size: 24px;
    }

    :host([size="sm"]) mpt-control-surface {
      min-width: 42px;
      height: 42px;
      --icon-size: 20px;
    }

    :host([size="lg"]) mpt-control-surface {
      min-width: 64px;
      height: 64px;
      --icon-size: 26px;
    }

    :host([size="xl"]) mpt-control-surface {
      min-width: 128px;
      height: 64px;
      --icon-size: 26px;
    }

    :host([shape="rounded"]) mpt-control-surface {
      --control-surface-border-radius: 32px;
    }

    :host([variant="plain"]) mpt-control-surface {
      background-color: transparent;
    }

    :host([variant="tonal"]) mpt-control-surface {
      --control-surface-background-color: rgb(
        from var(--tile-color) r g b / 20%
      );
    }

    :host([variant="filled"]) mpt-control-surface {
      --control-surface-background-color: var(--tile-color);
      --control-surface-color: var(--ha-card-background);
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
