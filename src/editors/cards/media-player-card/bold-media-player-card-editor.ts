import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardContentLayout,
  MediaPlayerTileConfig,
} from "../../../cards/media-player-card/types";
import { customElement } from "lit/decorators";
import {
  mdiButtonPointer,
  mdiPageLayoutBody,
  mdiPageLayoutHeader,
  mdiPalette,
  mdiStar,
} from "@mdi/js";
import { t } from "../../../localization/i18n";
import { MediaButtonControlConfig } from "../../../lib/controls/types";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithFeatures } from "../base";
import { cardConfigStruct } from "../../../cards/media-player-card/struct";
import { MediaPlayerEntity } from "../../../types/ha/entity";
import { presets } from "./constants";

@customElement("bold-media-player-card-editor")
export class BoldMediaPlayerCardEditor extends BoldLovelaceCardEditorWithFeatures<
  MediaPlayerTileConfig,
  MediaPlayerEntity
> {
  protected get _struct() {
    return cardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const entityId = this._config?.entity;
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;

    const schema = [
      {
        name: "entity",
        selector: { entity: { domain: "media_player" } },
      },
      {
        name: "appearance",
        flatten: true,
        type: "expandable",
        iconPath: mdiPalette,
        schema: [
          {
            name: "content_layout",
            required: true,
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  {
                    label: "Horizontal",
                    value: MediaPlayerCardContentLayout.HORIZONTAL,
                  },
                  {
                    label: "Vertical",
                    value: MediaPlayerCardContentLayout.VERTICAL,
                  },
                ],
              },
            },
          },
          {
            name: "",
            type: "grid",
            schema: [
              {
                name: "color_mode",
                required: true,
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      {
                        label: "Ambient",
                        value: MediaPlayerCardColorMode.AMBIENT,
                      },
                      {
                        label: "Ambient Vibrant",
                        value: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
                      },
                      {
                        label: "Picture Background",
                        value: MediaPlayerCardColorMode.PICTURE,
                      },
                      {
                        label: "Fixed Color",
                        value: MediaPlayerCardColorMode.MANUAL,
                      },
                    ],
                  },
                },
              },
              {
                name: "color",
                required: true,
                selector: {
                  ui_color: {
                    default_color: "state",
                    // include_state: true,
                  },
                },
              },
            ],
          },
        ],
      },
      {
        name: "title_bar",
        flatten: true,
        type: "expandable",
        iconPath: mdiPageLayoutHeader,
        schema: [
          {
            name: "show_title_bar",
            selector: {
              boolean: {},
            },
          },
        ],
      },
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabelCallback}
        .computeHelper=${this._computeHelperCallback}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiPageLayoutBody}></ha-svg-icon>
          ${t("editor.card.media_player.label.media_info")}
        </h3>
        <div class="content">
          <ha-alert alert-type="info">
            ${t("editor.common.wip_section_text")}
          </ha-alert>
        </div>
      </ha-expansion-panel>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiButtonPointer}></ha-svg-icon>
          <span>${t("editor.card.media_player.label.controls")}</span>
        </h3>
        <div class="content">
          <bc-controls-editor
            .controls=${this._config?.controls ?? []}
            .stateObj=${stateObj}
            @value-changed=${this._handleControlsChanged}
          ></bc-controls-editor>
        </div>
      </ha-expansion-panel>
      ${this._config?.features
        ?.filter(
          (feature) =>
            feature.type === "custom:media-player-control-button-row" ||
            feature.type === "custom:media-player-progress-control",
        )
        .map(
          (feature, index) =>
            html`<ha-expansion-panel outlined>
              <h3 slot="header">
                <ha-svg-icon .path=${mdiButtonPointer}></ha-svg-icon>
                <span>
                  ${t("editor.card.media_player.label.additional_controls", {
                    count: index + 2,
                  })}
                </span>
              </h3>
              <div class="content">
                <bc-controls-editor
                  .controls=${feature.controls ?? []}
                  .stateObj=${stateObj}
                ></bc-controls-editor>
              </div>
            </ha-expansion-panel>`,
        )}
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiStar}></ha-svg-icon>
          <span>${t("editor.common.label.presets")}</span>
        </h3>
        <div class="content">
          ${presets.map(
            (preset) => html`
              <ha-button
                @click=${() => this._setPreset(preset.config)}
                variant="filled"
                >${preset.name}</ha-button
              >
            `,
          )}
        </div>
      </ha-expansion-panel>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiListBox}></ha-svg-icon>
          ${t("editor.common.label.features")}
        </h3>
        <div class="content">
          <ha-alert alert-type="info">
            ${t("editor.common.wip_section_text")}
          </ha-alert>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _setPreset(partialConfig: Partial<MediaPlayerTileConfig>) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, ...partialConfig },
    });
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const newConfig = ev.detail.value as MediaPlayerTileConfig;

    const config: MediaPlayerTileConfig = {
      features: this._config.features,
      ...newConfig,
    };

    fireEvent(this, "config-changed", { config });
  }

  private _handleControlsChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const newControls = ev.detail.value as MediaButtonControlConfig[];

    const config: MediaPlayerTileConfig = {
      ...this._config,
      controls: newControls,
    };

    fireEvent(this, "config-changed", { config });
  }

  private _computeLabelCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.media_player.label",
    });
  };

  private _computeHelperCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.media_player.helper_text",
      defaultValue: "",
    });
  };

  static styles: CSSResultGroup = [
    editorBaseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ];
}
