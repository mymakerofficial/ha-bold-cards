import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistant } from "../../types/ha/lovelace";
import { t } from "../../localization/i18n";
import {
  MediaButtonControlConfig,
  ElementWhenUnavailable,
} from "../../lib/controls/types";
import { editorBaseStyles } from "../styles";
import { MediaPlayerEntity } from "../../types/ha/entity";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { getMediaButtonControlDefaultConfig } from "../../lib/controls/helpers";
import { enumToOptions } from "../helpers";

@customElement("bc-media-button-control-editor")
export class MediaButtonControlEditor extends LitElement {
  @property({ attribute: false }) public control?: MediaButtonControlConfig;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  protected _handleValueChanged(
    field: keyof MediaButtonControlConfig,
    ev: CustomEvent,
  ) {
    ev.stopPropagation();

    const newValue = {
      ...this.control!,
      [field]: ev.detail.value,
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
    const defaultConfig = getMediaButtonControlDefaultConfig(
      this.control?.action!,
      this.stateObj as MediaPlayerEntity,
    );

    return html`
      <div class="grid">
        <bc-selector-select
          .label=${t("editor.controls.media_button_control.label.size")}
          .required=${true}
          .hass=${this.hass}
          .value=${this.control?.size}
          .default=${defaultConfig.size}
          @value-changed=${(ev) => this._handleValueChanged("size", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonSize, {
                scope: "common.button.size",
              }),
            },
          }}
        ></bc-selector-select>
        <bc-selector-select
          .label=${t("editor.controls.media_button_control.label.variant")}
          .required=${true}
          .hass=${this.hass}
          .value=${this.control?.variant}
          .default=${defaultConfig.variant}
          @value-changed=${(ev) => this._handleValueChanged("variant", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonVariant, {
                scope: "common.button.variant",
              }),
            },
          }}
        ></bc-selector-select>
        <bc-selector-select
          .label=${t("editor.controls.media_button_control.label.shape")}
          .required=${true}
          .hass=${this.hass}
          .value=${this.control?.shape}
          .default=${defaultConfig.shape}
          @value-changed=${(ev) => this._handleValueChanged("shape", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ButtonShape, {
                scope: "common.button.shape",
              }),
            },
          }}
        ></bc-selector-select>
        <bc-selector-select
          .label=${t(
            "editor.controls.media_button_control.label.when_unavailable",
          )}
          .required=${true}
          .hass=${this.hass}
          .value=${this.control?.when_unavailable}
          .default=${defaultConfig.when_unavailable}
          @value-changed=${(ev) =>
            this._handleValueChanged("when_unavailable", ev)}
          .selector=${{
            select: {
              mode: "dropdown",
              options: enumToOptions(ElementWhenUnavailable, {
                scope: "common.element_when_unavailable",
              }),
            },
          }}
        ></bc-selector-select>
      </div>
    `;
  }

  static styles = [
    editorBaseStyles,
    css`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
      }
    `,
  ];
}
