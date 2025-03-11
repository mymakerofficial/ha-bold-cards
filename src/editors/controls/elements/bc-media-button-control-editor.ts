import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { t } from "../../../localization/i18n";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaButtonControlConfig,
} from "../../../lib/controls/types";
import { editorBaseStyles } from "../../styles";
import {
  getControlIcon,
  getMediaButtonControlDefaultConfig,
} from "../../../lib/controls/helpers";
import { enumToOptions } from "../../helpers";
import { getDefaultConfigTypeFromFeatureInternals } from "../../../lib/features/helpers";
import { ControlEditorBase } from "./base";
import { MediaPlayerEntity } from "../../../types/ha/entity";

@customElement("bc-media-button-control-editor")
export class MediaButtonControlEditor extends ControlEditorBase<
  MediaButtonControlConfig,
  MediaPlayerEntity
> {
  protected render() {
    if (
      !this.control ||
      this.control.type !== ControlType.MEDIA_BUTTON ||
      !this.hass
    ) {
      return nothing;
    }

    const defaultConfig = getMediaButtonControlDefaultConfig(
      this.control.action,
      getDefaultConfigTypeFromFeatureInternals(this.internals),
    );

    const allowShowAlways = (
      [
        MediaButtonAction.TURN_OFF,
        MediaButtonAction.TURN_ON,
        MediaButtonAction.MEDIA_PAUSE,
        MediaButtonAction.MEDIA_PLAY,
      ] as string[]
    ).includes(this.control.action);

    return html`
      <div class="container">
        <bc-button-config-editor
          .config=${this.control}
          .hass=${this.hass}
          .defaultConfig=${defaultConfig}
          .iconPlaceholder=${getControlIcon(this.control, this.stateObj)}
          @value-changed=${(ev) =>
            this.dispatchEvent(
              new CustomEvent("value-changed", {
                detail: ev.detail,
              }),
            )}
        >
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
                  labelScope: "common.element_when_unavailable",
                }),
              },
            }}
          ></bc-selector-select>
        </bc-button-config-editor>
        ${allowShowAlways
          ? html`<ha-selector-boolean
              .label=${t(
                "editor.controls.media_button_control.label.always_show",
              )}
              .helper=${t(
                "editor.controls.media_button_control.helper.always_show",
              )}
              .value=${this.control?.always_show ?? false}
              @value-changed=${(ev) =>
                this._handleValueChanged("always_show", ev)}
            ></ha-selector-boolean>`
          : nothing}
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
    `,
  ];
}
