import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import {
  BoldMediaPlayerCardConfig,
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
} from "../../../cards/media-player-card/types";
import { customElement } from "lit/decorators.js";
import { mdiCursorMove, mdiPalette, mdiStar, mdiTextShort } from "@mdi/js";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithFeatures } from "../base";
import {
  mediaPlayerAllowedFeaturePositions,
  mediaPlayerAllowedPicturePositions,
  mediaPlayerAllowedTextPositions,
  mediaPlayerCardConfigStruct,
} from "../../../cards/media-player-card/struct";
import { MediaPlayerEntity } from "../../../types/ha/entity";
import { presets } from "./constants";
import { enumToOptions } from "../../helpers";
import { VerticalPosition } from "../../../lib/layout/position";

@customElement("bold-media-player-card-editor")
export class BoldMediaPlayerCardEditor extends BoldLovelaceCardEditorWithFeatures<
  BoldMediaPlayerCardConfig,
  MediaPlayerEntity
> {
  constructor() {
    super();
    import("../../controls/bc-controls-editor");
  }

  protected get _struct() {
    return mediaPlayerCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = [
      {
        name: "appearance",
        flatten: true,
        type: "expandable",
        iconPath: mdiPalette,
        schema: [
          {
            name: "background_picture",
            required: true,
            selector: {
              select: {
                mode: "dropdown",
                options: enumToOptions(MediaPlayerCardBackgroundPictureStyle, {
                  labelScope:
                    "common.media_player_card_background_picture_style",
                }),
              },
            },
          },
          {
            name: "color_mode",
            required: true,
            selector: {
              select: {
                mode: "dropdown",
                options: enumToOptions(MediaPlayerCardColorMode, {
                  labelScope: "common.media_player_card_color_mode",
                }),
              },
            },
          },
          {
            name: "color",
            required: true,
            selector: {
              ui_color: {
                default_color: "primary",
              },
            },
          },
        ],
      },
      {
        name: "content",
        flatten: true,
        type: "expandable",
        iconPath: mdiTextShort,
        schema: [
          {
            name: "show_title_bar",
            selector: {
              boolean: {},
            },
          },
          {
            name: "placeholder_when_off",
            selector: {
              boolean: {},
            },
          },
        ],
      },
    ];

    return html`
      <ha-selector
        .selector=${{
          entity: { domain: "media_player" },
        }}
        .label=${t("editor.card.media_player.label.entity")}
        .value=${this._config?.entity}
        @value-changed=${(ev) => this.handleValueChanged("entity", ev)}
        .hass=${this.hass}
      ></ha-selector>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCursorMove}></ha-svg-icon>
          <span>${t("editor.card.media_player.label.layout")}</span>
        </h3>
        <div class="content flex-col">
          <bc-form-element
            .label=${t("editor.card.media_player.label.picture_position")}
          >
            <bc-layout-select
              .label=${t("editor.card.media_player.label.picture_position")}
              .hideLabel=${true}
              .value=${this._config.picture_position}
              .positions=${mediaPlayerAllowedPicturePositions}
              @value-changed=${(ev) =>
                this.handleValueChanged("picture_position", ev)}
            ></bc-layout-select>
          </bc-form-element>
          <bc-form-element
            .label=${t("editor.card.media_player.label.show_picture")}
          >
            <ha-selector
              .selector=${{
                boolean: {},
              }}
              .value=${this._config?.show_picture ?? true}
              @value-changed=${(ev) =>
                this.handleValueChanged("show_picture", ev)}
            ></ha-selector>
          </bc-form-element>
          <bc-form-element
            .label=${t("editor.card.media_player.label.text_position")}
          >
            <bc-layout-select
              .label=${t("editor.card.media_player.label.text_position")}
              .hideLabel=${true}
              .value=${this._config.text_position}
              .positions=${mediaPlayerAllowedTextPositions}
              @value-changed=${(ev) =>
                this.handleValueChanged("text_position", ev)}
              .hass=${this.hass}
            ></bc-layout-select>
          </bc-form-element>
          <bc-form-element
            .label=${t("editor.card.media_player.label.show_text")}
          >
            <ha-selector
              .selector=${{
                boolean: {},
              }}
              .value=${this._config?.show_text ?? true}
              @value-changed=${(ev) => this.handleValueChanged("show_text", ev)}
            ></ha-selector>
          </bc-form-element>
          <bc-layout-select
            .label=${t("editor.card.media_player.label.feature_position")}
            .positions=${mediaPlayerAllowedFeaturePositions}
            .value=${this._config?.feature_position ?? VerticalPosition.BOTTOM}
            @value-changed=${(ev) =>
              this.handleValueChanged("feature_position", ev)}
            .hass=${this.hass}
          ></bc-layout-select>
        </div>
      </ha-expansion-panel>
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
      ${this._featureEditorTemplate()}
    `;
  }

  private _setPreset(partialConfig: Partial<BoldMediaPlayerCardConfig>) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, ...partialConfig },
    });
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const newConfig = ev.detail.value as BoldMediaPlayerCardConfig;

    const config: BoldMediaPlayerCardConfig = {
      features: this._config.features,
      ...newConfig,
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

      .grid-2 {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 0.5fr);
        grid-template-areas: "a c" "b d";
        gap: 12px;
      }

      .grid-2 *:nth-child(1) {
        grid-area: a;
      }
      .grid-2 *:nth-child(2) {
        grid-area: b;
      }
      .grid-2 *:nth-child(3) {
        grid-area: c;
      }
      .grid-2 *:nth-child(4) {
        grid-area: d;
      }
    `,
  ];
}
