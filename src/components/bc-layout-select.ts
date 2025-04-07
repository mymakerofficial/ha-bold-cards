import { css, html, nothing } from "lit";
import {
  arrayToOptions,
  stopPropagation,
  valueToOption,
} from "../editors/helpers";
import { BoldHassElement } from "./hass-element";
import { SelectOption } from "../types/ha/selector";
import { fireEvent } from "custom-card-helpers";
import { customElement, property } from "lit/decorators";
import { classMap } from "lit-html/directives/class-map";
import { styleMap } from "lit-html/directives/style-map";
import { isDefined } from "../lib/helpers";

export const HorizontalPosition = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type HorizontalPosition =
  (typeof HorizontalPosition)[keyof typeof HorizontalPosition];

export const VerticalPosition = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
} as const;
export type VerticalPosition =
  (typeof VerticalPosition)[keyof typeof VerticalPosition];

export const Position = {
  TOP_LEFT: `${VerticalPosition.TOP}-${HorizontalPosition.LEFT}`,
  TOP_CENTER: `${VerticalPosition.TOP}-${HorizontalPosition.CENTER}`,
  TOP_RIGHT: `${VerticalPosition.TOP}-${HorizontalPosition.RIGHT}`,
  MIDDLE_LEFT: `${VerticalPosition.MIDDLE}-${HorizontalPosition.LEFT}`,
  MIDDLE_CENTER: `${VerticalPosition.MIDDLE}-${HorizontalPosition.CENTER}`,
  MIDDLE_RIGHT: `${VerticalPosition.MIDDLE}-${HorizontalPosition.RIGHT}`,
  BOTTOM_LEFT: `${VerticalPosition.BOTTOM}-${HorizontalPosition.LEFT}`,
  BOTTOM_CENTER: `${VerticalPosition.BOTTOM}-${HorizontalPosition.CENTER}`,
  BOTTOM_RIGHT: `${VerticalPosition.BOTTOM}-${HorizontalPosition.RIGHT}`,
} as const;
export type Position = (typeof Position)[keyof typeof Position];

export const TopRowPositions: Position[] = [
  Position.TOP_LEFT,
  Position.TOP_CENTER,
  Position.TOP_RIGHT,
];
export const MiddleRowPositions: Position[] = [
  Position.MIDDLE_LEFT,
  Position.MIDDLE_CENTER,
  Position.MIDDLE_RIGHT,
];
export const BottomRowPositions: Position[] = [
  Position.BOTTOM_LEFT,
  Position.BOTTOM_CENTER,
  Position.BOTTOM_RIGHT,
];

export function splitPosition(
  position: Position,
): [VerticalPosition, HorizontalPosition] {
  const [vertical, horizontal] = position.split("-");
  return [vertical as VerticalPosition, horizontal as HorizontalPosition];
}

const iconMap = {
  [Position.TOP_LEFT]: "mdi:arrow-top-left-thin",
  [Position.TOP_CENTER]: "mdi:arrow-up-thin",
  [Position.TOP_RIGHT]: "mdi:arrow-top-right-thin",
  [Position.MIDDLE_LEFT]: "mdi:arrow-left-thin",
  [Position.MIDDLE_CENTER]: "mdi:border-radius",
  [Position.MIDDLE_RIGHT]: "mdi:arrow-right-thin",
  [Position.BOTTOM_LEFT]: "mdi:arrow-bottom-left-thin",
  [Position.BOTTOM_CENTER]: "mdi:arrow-down-thin",
  [Position.BOTTOM_RIGHT]: "mdi:arrow-bottom-right-thin",
};

const optionsLayout: Position[][] = [
  TopRowPositions,
  MiddleRowPositions,
  BottomRowPositions,
];

@customElement("bc-layout-select")
export class BcLayoutSelect extends BoldHassElement {
  @property({ attribute: false }) public value?: string;
  @property({ attribute: false }) public positions?: Position[];

  @property({ attribute: false }) public label?: string;

  render() {
    const availablePositions = this.positions || Object.values(Position);
    const options = optionsLayout.map((row) => {
      return row
        .filter((it) => availablePositions.includes(it))
        .map((it) =>
          valueToOption(it, {
            icon: iconMap,
            hideLabel: true,
          }),
        );
    });

    return html`
      ${isDefined(this.label) ? html`<label>${this.label}</label>` : nothing}
      <div role="radiogroup" class="grid">
        ${options.map((row) => {
          const itemColSpan = (3 / row.length) * 2;
          return row.map((option) => this._renderOption(option, itemColSpan));
        })}
      </div>
    `;
  }

  private _renderOption(option: SelectOption, colSpan = 1) {
    const selected = option.value === this.value || false;

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
      flex-direction: column;
      gap: 8px;
    }

    label {
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(6, min-content);
      gap: 12px;
    }

    .option {
      position: relative;
      border: 1px solid var(--outline-color);
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
      transition:
        background-color 180ms ease-in-out,
        box-shadow 180ms ease-in-out;
    }

    .option:before {
      content: "";
      display: block;
      inset: 0;
      position: absolute;
      background-color: transparent;
      pointer-events: none;
      opacity: 0.2;
      transition:
        background-color 180ms ease-in-out,
        opacity 180ms ease-in-out;
    }

    .option:hover {
      background-color: rgb(from var(--divider-color) r g b / 20%);
    }

    .option[data-selected="true"] {
      background-color: rgb(from var(--primary-color) r g b / 20%);
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
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
