import { css, html, LitElement, nothing } from "lit";
import { t } from "../../../localization/i18n";
import { customElement, property } from "lit/decorators";
import { ButtonBaseConfig } from "../../../lib/controls/types";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { enumToOptions } from "../../helpers";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../../components/bc-button";

@customElement("bc-button-config-editor")
export class ButtonConfigEditor extends LitElement {
  @property({ attribute: false }) public config?: ButtonBaseConfig;
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public labelScope =
    "editor.controls.media_button_control.label";

  @property({ attribute: false }) public defaultConfig?: ButtonBaseConfig;
  @property({ attribute: false }) public iconPlaceholder?: string;

  protected _handleValueChanged(
    field: keyof ButtonBaseConfig,
    ev: CustomEvent,
  ) {
    ev.stopPropagation();

    const newValue = {
      ...this.config!,
      [field]: ev.detail.value === "" ? undefined : ev.detail.value,
    };

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }

  protected render() {
    if (!this.config || !this.defaultConfig || !this.hass) {
      return nothing;
    }

    return html`
      <ha-icon-picker
        .label=${t("icon", {
          scope: this.labelScope,
        })}
        .hass=${this.hass}
        .value=${this.config.icon}
        .placeholder=${this.iconPlaceholder}
        @value-changed=${(ev) => this._handleValueChanged("icon", ev)}
      ></ha-icon-picker>
      <div class="grid">
        <bc-selector-select
          .label=${t("size", {
            scope: this.labelScope,
          })}
          .hass=${this.hass}
          .value=${this.config.size}
          .default=${this.defaultConfig.size}
          @value-changed=${(ev) => this._handleValueChanged("size", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonSize, {
                labelScope: "common.button.size",
              }),
            },
          }}
        ></bc-selector-select>
        <bc-selector-select
          .label=${t("variant", {
            scope: this.labelScope,
          })}
          .hass=${this.hass}
          .value=${this.config.variant}
          .default=${this.defaultConfig.variant}
          @value-changed=${(ev) => this._handleValueChanged("variant", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonVariant, {
                labelScope: "common.button.variant",
              }),
            },
          }}
        ></bc-selector-select>
        <bc-selector-select
          .label=${t("shape", {
            scope: this.labelScope,
          })}
          .hass=${this.hass}
          .value=${this.config.shape}
          .default=${this.defaultConfig.shape}
          @value-changed=${(ev) => this._handleValueChanged("shape", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonShape, {
                labelScope: "common.button.shape",
              }),
            },
          }}
        ></bc-selector-select>
        <slot></slot>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 8px;
    }
  `;
}
