import { css, html, nothing } from "lit";
import { stopPropagation, valueToOption } from "../editors/helpers";
import { BoldHassElement } from "./hass-element";
import { SelectOption } from "../types/ha/selector";
import { fireEvent, handleClick } from "custom-card-helpers";
import { customElement, property } from "lit/decorators";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { isDefined } from "../lib/helpers";
import {
  BottomRowPositions,
  MiddleRowPositions,
  Position,
  TopRowPositions,
} from "../lib/layout/position";
import { GetterOrMap } from "../lib/types";

@customElement("bc-boolean-toggle")
export class BcLayoutSelect extends BoldHassElement {
  @property({ attribute: false }) public value?: boolean;

  @property({ attribute: false }) public label?: string;
  @property({ attribute: false, type: Boolean }) public hideLabel?: boolean;

  @property({ attribute: false }) public optionLabel?: GetterOrMap<
    "true" | "false",
    string
  >;
  @property({ attribute: false }) public optionLabelScope?: string;
  @property({ attribute: false }) public optionIcon?: GetterOrMap<
    "true" | "false",
    string
  >;

  private _handleClick() {
    this.value = !this.value;
    fireEvent(this, "value-changed", {
      value: this.value,
    });
  }

  render() {
    const selectedOption = valueToOption(
      String(Boolean(this.value)) as "true" | "false",
      {
        label: this.optionLabel,
        labelScope: this.optionLabelScope ?? "common.boolean_toggle",
        icon: this.optionIcon ?? {
          true: "mdi:check",
          false: "mdi:close",
        },
      },
    );

    return html`
      ${
        isDefined(this.label)
          ? html`<label
              class=${classMap({
                "visually-hidden": !!this.hideLabel,
              })}
              >${this.label}</label
            >`
          : nothing
      }
      <ha-button ?raised=${this.value === true} ?outlined=${this.value === false} @click=${this._handleClick}>
          ${
            isDefined(selectedOption.icon)
              ? html`<bc-icon
                  icon=${selectedOption.icon}
                  slot="icon"
                ></bc-icon>`
              : nothing
          }
        ${selectedOption.label}
      </ha-button>
      </ha-button-menu>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .visually-hidden {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;
}
