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
  LG: "lg",
} as const;
export type ButtonSize = (typeof ButtonSize)[keyof typeof ButtonSize];

@customElement("mpt-button")
export class Button extends ControlSurface {
  @property() public iconPath?: string;

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
      --button-size: 64px;
      --icon-size: 40%;
    }

    :host([size="sm"]) {
      --button-size: var(--feature-height, 42px);
      --icon-size: var(--feature-height, 42px);
    }

    :host([shape="rounded"]) mpt-control-surface {
      --control-surface-border-radius: 50%;
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

    mpt-control-surface {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--button-size);
      height: var(--button-size);
      --control-button-border-radius: calc(
        var(--ha-card-border-radius, 12px) / 2
      );
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
