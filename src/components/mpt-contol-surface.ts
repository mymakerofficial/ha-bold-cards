import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";
import { ifDefined } from "lit-html/directives/if-defined";

@customElement("mpt-control-surface")
export class ControlSurface extends LitElement {
  @property({ type: Boolean, reflect: true }) disabled = false;

  @property() public label?: string;

  protected render() {
    return html`
      <button
        type="button"
        class="button"
        aria-label=${ifDefined(this.label)}
        title=${ifDefined(this.label)}
        .disabled=${Boolean(this.disabled)}
      >
        <slot></slot>
        <ha-ripple .disabled=${this.disabled}></ha-ripple>
      </button>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --control-surface-color: var(--tile-color, --primary-text-color);
      --control-surface-background-color: transparent;
      --control-surface-border-radius: 10px;
      --control-surface-padding: 8px;
      --mdc-icon-size: 20px;
      --ha-ripple-color: var(--control-surface-color);
      --ha-ripple-hover-opacity: 0.04;
      --ha-ripple-pressed-opacity: 0.12;
      color: var(--control-surface-color);
      -webkit-tap-highlight-color: transparent;
      transition:
        min-width 180ms ease-in-out,
        height 180ms ease-in-out,
        border-radius 180ms ease-in-out,
        background-color 180ms ease-in-out,
        color 180ms ease-in-out;
    }

    .button {
      overflow: hidden;
      position: relative;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 100%;
      border-radius: var(--control-surface-border-radius);
      border: none;
      margin: 0;
      padding: var(--control-surface-padding);
      box-sizing: border-box;
      line-height: inherit;
      font-family: Roboto;
      font-weight: 500;
      outline: none;
      overflow: hidden;
      background: var(--control-surface-background-color);
      /* For safari border-radius overflow */
      z-index: 0;
      font-size: inherit;
      color: inherit;
    }

    .button {
      transition: color 180ms ease-in-out;
      color: var(--control-surface-color);
    }

    .button ::slotted(*) {
      pointer-events: none;
    }

    .button:disabled {
      cursor: not-allowed;
      --control-surface-background-color: var(--disabled-color);
      --control-surface-color: var(--disabled-text-color);
    }

    .button {
      transition: box-shadow 180ms ease-in-out;
    }

    .button:focus-visible {
      box-shadow: 0 0 0 2px var(--control-surface-color);
    }
  `;
}
