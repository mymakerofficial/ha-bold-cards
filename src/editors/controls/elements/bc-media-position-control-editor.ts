import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { t } from "../../../localization/i18n";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaPositionControlConfig,
} from "../../../lib/controls/types";
import { editorBaseStyles } from "../../styles";
import { enumToOptions } from "../../helpers";
import { MediaPositionTimestampPosition } from "../../../components/bc-media-position-control";
import { ControlEditorBase } from "./base";
import { MediaPlayerEntity } from "../../../types/ha/entity";

@customElement("bc-media-position-control-editor")
export class MediaPositionControlEditor extends ControlEditorBase<
  MediaPositionControlConfig,
  MediaPlayerEntity
> {
  protected render() {
    if (
      !this.control ||
      this.control.type !== ControlType.MEDIA_POSITION ||
      !this.hass
    ) {
      return nothing;
    }

    return html`
      <div class="container">
        <div class="grid">
          <bc-selector-select
            .label=${t(
              "editor.controls.media_position_control.label.timestamp_position",
            )}
            .hass=${this.hass}
            .value=${this.control.timestamp_position}
            .default=${MediaPositionTimestampPosition.HIDDEN}
            @value-changed=${(ev) =>
              this._handleValueChanged("timestamp_position", ev)}
            .selector=${{
              select: {
                mode: "dropdown",
                options: enumToOptions(MediaPositionTimestampPosition, {
                  labelScope: "common.timestamp_position",
                }),
              },
            }}
          ></bc-selector-select>
          <bc-selector-select
            .label=${t(
              "editor.controls.media_position_control.label.when_unavailable",
            )}
            .helper=${t(
              "editor.controls.media_position_control.helper.when_unavailable",
            )}
            .hass=${this.hass}
            .value=${this.control.when_unavailable}
            .default=${ElementWhenUnavailable.DISABLE}
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
        </div>
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

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
      }
    `,
  ];
}
