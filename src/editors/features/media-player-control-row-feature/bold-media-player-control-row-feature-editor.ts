import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { BoldMediaPlayerControlRowFeatureConfig } from "../../../features/media-player-control-row-feature/types";
import { css, html } from "lit";
import { mediaPlayerControlRowFeatureStruct } from "../../../features/media-player-control-row-feature/struct";
import { fireEvent } from "custom-card-helpers";
import { editorBaseStyles } from "../../styles";
import { t } from "../../../localization/i18n";
import {
  ElementWhenUnavailable,
  MediaButtonControlConfig,
} from "../../../lib/controls/types";
import { enumToOptions } from "../../helpers";

@customElement("bold-media-player-control-row-feature-editor")
export class BoldMediaPlayerControlRowFeatureEditor extends BoldLovelaceCardFeatureEditor<BoldMediaPlayerControlRowFeatureConfig> {
  protected get _struct() {
    return mediaPlayerControlRowFeatureStruct;
  }

  protected render() {
    return html`
      <div class="container">
        <div class="grid">
          <bc-selector-select
            .label=${t(
              "editor.controls.media_button_control.label.when_unavailable",
            )}
            .required=${true}
            .hass=${this.hass}
            .value=${this._config?.when_unavailable}
            .default=${ElementWhenUnavailable.DISABLE}
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
        <bc-controls-editor
          .controls=${this._config?.controls ?? []}
          .hass=${this.hass}
          .stateObj=${this.stateObj}
          @value-changed=${this._handleControlsChanged}
        ></bc-controls-editor>
      </div>
    `;
  }

  protected _handleValueChanged(
    field: keyof MediaButtonControlConfig,
    ev: CustomEvent,
  ) {
    ev.stopPropagation();

    fireEvent(this, "config-changed", {
      config: { ...this._config, [field]: ev.detail.value },
    });
  }

  protected _handleControlsChanged(ev: CustomEvent) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, controls: ev.detail.value },
    });
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
