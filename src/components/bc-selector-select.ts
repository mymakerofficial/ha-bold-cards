import { customElement, property } from "lit/decorators.js";
import { html } from "lit";
import { SelectSelector } from "../types/ha/selector";
import { t } from "../localization/i18n";
import { BoldHassElement } from "./hass-element";

@customElement("bc-selector-select")
export class BcSelectSelector extends BoldHassElement {
  @property({ attribute: false }) public selector!: SelectSelector;

  @property() public value?: string | string[];

  @property() public label?: string;

  @property() public helper?: string;

  @property({ type: Boolean }) public disabled = false;

  @property({ type: Boolean }) public required = true;

  @property({ attribute: false }) public default?: string;

  protected _valueChanged(ev: CustomEvent) {
    ev.stopPropagation();
    this.fireEvent("value-changed", {
      value:
        !!this.default && ev.detail.value === "__default__"
          ? undefined
          : ev.detail.value,
    });
  }

  protected get _value() {
    if (!!this.default && this.value == undefined) {
      return "__default__";
    }
    return this.value;
  }

  protected get _selector() {
    if (this.default) {
      const defaultOption =
        this.selector.select?.options?.find((option) =>
          typeof option === "string"
            ? option === this.default
            : option.value === this.default,
        ) ?? this.default;
      const defaultLabel =
        typeof defaultOption === "string" ? defaultOption : defaultOption.label;

      return {
        select: {
          ...this.selector.select,
          options: [
            {
              value: "__default__",
              label: t("editor.common.default_with_value", {
                value: defaultLabel,
              }),
            },
            ...(this.selector.select?.options ?? []),
          ],
        },
      };
    }

    return this.selector;
  }

  protected render() {
    return html`
      <ha-selector
        .hass=${this.hass}
        .selector=${this._selector}
        .value=${this._value}
        .label=${this.label}
        .helper=${this.helper}
        .disabled=${this.disabled}
        .required=${this.required}
        @value-changed=${this._valueChanged}
      ></ha-selector>
    `;
  }
}
