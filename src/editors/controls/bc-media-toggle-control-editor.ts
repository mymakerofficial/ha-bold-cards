import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistant } from "../../types/ha/lovelace";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaToggleControlConfig,
} from "../../lib/controls/types";
import { editorBaseStyles } from "../styles";
import { MediaPlayerEntity } from "../../types/ha/entity";
import {
  getControlIcon,
  getControlLabel,
  getMediaButtonControlDefaultConfig,
  getMediaToggleControlDefaultConfig,
  mediaToggleActionToMediaButtonControlConfig,
} from "../../lib/controls/helpers";
import { repeat } from "lit-html/directives/repeat";
import { mediaToggleKindActionMap } from "../../lib/controls/constants";
import { enumToOptions } from "../helpers";
import { t } from "../../localization/i18n";

@customElement("bc-media-toggle-control-editor")
export class MediaToggleControlEditor extends LitElement {
  @property({ attribute: false }) public control?: MediaToggleControlConfig;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  protected _handleValueChanged(
    field: keyof MediaToggleControlConfig,
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
    if (
      !this.control ||
      this.control.type !== ControlType.MEDIA_TOGGLE ||
      !this.hass
    ) {
      return nothing;
    }

    const defaultConfig = getMediaToggleControlDefaultConfig(this.control.kind);

    return html`
      <div class="container">
        <bc-selector-select
          .label=${t(
            "editor.controls.media_button_control.label.when_unavailable",
          )}
          .helper=${t(
            "editor.controls.media_button_control.helper.when_unavailable",
          )}
          .hass=${this.hass}
          .value=${this.control.when_unavailable}
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
        ${repeat(mediaToggleKindActionMap[this.control.kind], (action) => {
          const buttonConfig = mediaToggleActionToMediaButtonControlConfig(
            this.control!,
            action,
          );

          const defaultButtonConfig = getMediaButtonControlDefaultConfig(
            action,
            this.stateObj,
          );

          return html`
            <div class="action">
              <h4 class="header">
                <ha-icon .icon=${getControlIcon(buttonConfig)}></ha-icon>
                <span>${getControlLabel(buttonConfig)}</span>
              </h4>
              <bc-button-config-editor
                .config=${this.control![action] ?? {}}
                .hass=${this.hass}
                .defaultConfig=${defaultButtonConfig}
                .iconPlaceholder=${getControlIcon(buttonConfig)}
                @value-changed=${(ev) => this._handleValueChanged(action, ev)}
              ></bc-button-config-editor>
            </div>
          `;
        })}
      </div>
    `;
  }

  static styles = [
    editorBaseStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .action {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .action .header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-weight: 500;
      }
    `,
  ];
}
