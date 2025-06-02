import { css, html, nothing } from "lit";
import { stopPropagation, valueToOption } from "../editors/helpers";
import { BoldHassElement } from "./hass-element";
import { SelectOption } from "../types/ha/selector";
import { fireEvent } from "custom-card-helpers";
import { customElement, property } from "lit/decorators";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { isDefined } from "../lib/helpers";
import {
  BottomRowPositions,
  ExtendedPosition,
  HorizontalPosition,
  HorizontalPositions,
  InlinePosition,
  InlinePositions,
  MiddleRowPositions,
  Position,
  TopRowPositions,
  VerticalPosition,
} from "../lib/layout/position";
import { GetterOrMap } from "../lib/types";

const iconMap = {
  [Position.TOP_LEFT]: "bold:align-box-top-left",
  [Position.TOP_CENTER]: "bold:align-box-top-center",
  [Position.TOP_RIGHT]: "bold:align-box-top-right",
  [Position.MIDDLE_LEFT]: "bold:align-box-middle-left",
  [Position.MIDDLE_CENTER]: "bold:align-box-middle-center",
  [Position.MIDDLE_RIGHT]: "bold:align-box-middle-right",
  [Position.BOTTOM_LEFT]: "bold:align-box-bottom-left",
  [Position.BOTTOM_CENTER]: "bold:align-box-bottom-center",
  [Position.BOTTOM_RIGHT]: "bold:align-box-bottom-right",
  [HorizontalPosition.LEFT]: "bold:align-box-middle-left",
  [HorizontalPosition.CENTER]: "bold:align-box-middle-center",
  [HorizontalPosition.RIGHT]: "bold:align-box-middle-right",
  [VerticalPosition.TOP]: "bold:align-box-top-center",
  [VerticalPosition.MIDDLE]: "bold:align-box-middle-center",
  [VerticalPosition.BOTTOM]: "bold:align-box-bottom-center",
  [InlinePosition.INLINE_LEFT]: "bold:align-box-inline-left",
  [InlinePosition.INLINE_RIGHT]: "bold:align-box-inline-right",
};

const optionsLayout: ExtendedPosition[][] = [
  [...TopRowPositions, VerticalPosition.TOP],
  [
    ...MiddleRowPositions,
    ...HorizontalPositions,
    ...InlinePositions,
    VerticalPosition.MIDDLE,
  ],
  [...BottomRowPositions, VerticalPosition.BOTTOM],
];

@customElement("bc-layout-select")
export class BcLayoutSelect extends BoldHassElement {
  @property({ attribute: false }) public value?: ExtendedPosition;
  @property({ attribute: false }) public positions?: ExtendedPosition[];

  @property({ attribute: false }) public label?: string;
  @property({ attribute: false, type: Boolean }) public hideLabel?: boolean;

  @property({ attribute: false }) public optionLabel?: GetterOrMap<
    ExtendedPosition,
    string
  >;
  @property({ attribute: false }) public optionLabelScope?: string;
  @property({ attribute: false }) public optionIcon?: GetterOrMap<
    ExtendedPosition,
    string
  >;

  private get _availablePositions() {
    return this.positions || Object.values(Position);
  }

  private get _value() {
    return this.value ?? this._availablePositions[0];
  }

  render() {
    const availablePositions = this._availablePositions;
    const value = this._value;

    const props = {
      label: this.optionLabel,
      labelScope: this.optionLabelScope ?? "common.position",
      icon: this.optionIcon ?? iconMap,
      hideLabel: true,
    };

    const options = optionsLayout.map((row) => {
      return row
        .filter((it) => availablePositions.includes(it))
        .map((it) => valueToOption(it, props));
    });

    const selectedOption = valueToOption(value, props);

    return html`
      ${isDefined(this.label)
        ? html`<label
            class=${classMap({
              "visually-hidden": !!this.hideLabel,
            })}
            >${this.label}</label
          >`
        : nothing}
      <ha-button-menu
        style=${styleMap({
          "--mdc-list-vertical-padding": 0,
        })}
        fixed
        @closed=${stopPropagation}
      >
        <ha-button slot="trigger">
          <bc-icon .icon=${selectedOption.icon} slot="icon"></bc-icon>
          ${selectedOption.label}
        </ha-button>
        <div role="radiogroup" class="grid">
          ${options.map((row) => {
            const itemColSpan = (3 / row.length) * 2;
            return row.map((option) => this._renderOption(option, itemColSpan));
          })}
        </div>
      </ha-button-menu>
    `;
  }

  private _renderOption(option: SelectOption, colSpan = 1) {
    const selected = option.value === this._value || false;
    const isDark = this.hass?.themes.darkMode || false;

    const imageSrc =
      typeof option.image === "object"
        ? (isDark && option.image.src_dark) || option.image.src
        : option.image;

    return html`
      <label
        data-selected=${selected}
        class="option"
        @click=${this._labelClick}
        style=${styleMap({
          "grid-column": `span ${colSpan}`,
        })}
      >
        <div class="content">
          <ha-radio
            class="visually-hidden"
            .checked=${selected}
            .value=${option.value}
            @change=${() => this._radioChanged(option.value)}
            @click=${stopPropagation}
          ></ha-radio>
          <bc-icon .icon=${option.icon}></bc-icon>
          <div
            class="text ${classMap({
              "visually-hidden": !!option.hideLabel && !option.description,
            })}"
          >
            <span
              class="label ${classMap({
                "visually-hidden": !!option.hideLabel,
              })}"
              >${option.label}</span
            >
            ${option.description
              ? html`<span class="description">${option.description}</span>`
              : nothing}
          </div>
        </div>
        ${imageSrc ? html` <img alt="" src=${imageSrc} /> ` : nothing}
      </label>
    `;
  }

  private _labelClick(ev) {
    ev.stopPropagation();
    ev.currentTarget.querySelector("ha-radio")?.click();
  }

  private _radioChanged(value: string) {
    console.log(value);
    if (value === this.value) {
      return;
    }
    fireEvent(this, "value-changed", {
      value,
    });
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    label {
    }

    .grid {
      padding: 8px;
      display: grid;
      grid-template-columns: repeat(6, min-content);
      gap: 12px;
    }

    .option {
      position: relative;
      border-radius: var(--ha-card-border-radius, 12px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      gap: 8px;
      overflow: hidden;
      cursor: pointer;
      box-sizing: content-box;
      transition: background-color 180ms ease-in-out;
    }

    .option:hover {
      background-color: rgb(from var(--divider-color) r g b / 20%);
    }

    .option[data-selected="true"] {
      background-color: rgb(from var(--primary-color) r g b / 20%);
      color: var(--primary-color);
    }

    .option .content {
      position: relative;
      display: flex;
      flex-direction: row;
      gap: 8px;
      min-width: 0;
      width: 100%;
      justify-content: center;
    }

    .option .content ha-radio {
      margin: -12px;
      flex: none;
    }

    .option .content .text {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    .option .content .text .label {
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .option .content .text .description {
      color: var(--secondary-text-color);
      font-size: 13px;
      font-weight: 400;
      line-height: 16px;
    }

    img {
      position: relative;
      max-width: var(--ha-select-box-image-size, 96px);
      max-height: var(--ha-select-box-image-size, 96px);
      margin: auto;
    }

    .visually-hidden {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;
}
