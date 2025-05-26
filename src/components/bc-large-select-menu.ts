import { customElement } from "lit/decorators.js";
import type { SelectBase } from "@material/mwc-select/mwc-select-base";
import { html } from "lit-html";
import { classMap } from "lit-html/directives/class-map.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { css, nothing } from "lit";
import { styleMap } from "lit-html/directives/style-map.js";

// home assistant doesn't import mwc-select-menu
//  but ha-control-select-menu extends its base
//  so this is a workaround to get to the base class implementation
const HaControlSelectMenu = customElements.get(
  "ha-control-select-menu",
) as new () => SelectBase;

@customElement("bc-large-select-menu")
export class BcLargeSelectMenu extends HaControlSelectMenu {
  public override render() {
    const classes = {
      "select-disabled": this.disabled,
      "select-required": this.required,
      "select-invalid": !this.isUiValid,
      "select-no-value": !this.selectedText,
    };

    const labelledby = this.label;
    const labelAttribute = this.label;

    return html`
      <div class="select ${classMap(classes)}">
        <input
          class="formElement"
          .name=${this.name}
          .value=${this.value}
          hidden
          ?disabled=${this.disabled}
          ?required=${this.required}
        />
        <!-- @ts-ignore -->
        <div
          class="select-anchor"
          aria-autocomplete="none"
          role="combobox"
          aria-expanded=${this.menuOpen}
          aria-invalid=${!this.isUiValid}
          aria-haspopup="listbox"
          aria-labelledby=${ifDefined(labelledby)}
          aria-label=${ifDefined(labelAttribute)}
          aria-required=${this.required}
          aria-controls="listbox"
          @focus=${this.onFocus}
          @blur=${this.onBlur}
          @click=${this.onClick}
          @keydown=${this.onKeydown}
        >
          <div
            class="container"
            style=${styleMap({
              "--feature-size": 1.5,
            })}
          >
            <p id="label" class="label">${this.label}</p>
            ${this.selectedText
              ? html`<p class="value">${this.selectedText}</p>`
              : nothing}
            ${this._renderIcon()}
            <ha-ripple .disabled=${this.disabled}></ha-ripple>
          </div>
        </div>
        ${this.renderMenu()}
      </div>
    `;
  }

  private _renderIcon() {
    const index = this.mdcFoundation?.getSelectedIndex();
    const items = this.menuElement?.items ?? [];
    const item = index != null ? items[index] : undefined;
    const defaultIcon = this.querySelector("[slot='icon']");
    const icon = item?.querySelector("[slot='graphic']") ?? null;

    if (!defaultIcon && !icon) {
      return null;
    }

    return html`
      <div class="icon">
        ${icon && icon.localName === "ha-svg-icon" && "path" in icon
          ? html`<ha-svg-icon .path=${icon.path}></ha-svg-icon>`
          : icon && icon.localName === "ha-icon" && "icon" in icon
            ? html`<ha-icon .icon=${icon.icon}></ha-icon>`
            : html`<slot name="icon"></slot>`}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --feature-background: color-mix(
          in srgb,
          var(--ha-card-background),
          var(--lovelace-background) 80%
        );
        --mdc-theme-primary: var(--tile-color, var(--primary-color));
      }

      * {
        box-sizing: border-box;
      }

      *:focus {
        outline: none;
      }

      p {
        margin: 0;
      }

      .select-anchor {
        cursor: pointer;
      }

      .container {
        position: relative;
        --container-height: calc(
          var(--feature-height) * var(--feature-size) + var(--feature-gap) *
            (var(--feature-size) - 1)
        );
        height: var(--container-height);
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "label icon" "value icon";
        background: var(--feature-background);
        border-radius: calc(
          var(--ha-card-border-radius, 12px) - var(--feature-gap) / 2
        );
        padding: 16px;
        overflow: hidden;
        transition: box-shadow 180ms ease-in-out;
      }

      .select:has(:focus-visible) .container {
        box-shadow: 0 0 0 2px var(--tile-color);
      }

      .label {
        grid-area: label;
        font-size: 0.8rem;
        font-weight: 500;
        opacity: 0.5;
        line-height: unset;
        margin-left: 4px;
        align-self: end;
      }

      .value {
        grid-area: value;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: unset;
        margin-left: 4px;
        align-self: start;
      }

      .icon {
        grid-area: icon;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        aspect-ratio: 1 / 1;
        background-color: var(--tile-color, var(--primary-color));
        color: var(--feature-background);
        border-radius: calc(var(--container-height) / 4);
      }
    `;
  }
}
