import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import {
  BoldMediaPlayerCardConfig,
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
} from "../../../cards/media-player-card/types";
import { customElement } from "lit/decorators";
import { mdiCursorMove, mdiPalette, mdiStar, mdiTextShort } from "@mdi/js";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithFeatures } from "../base";
import { mediaPlayerCardConfigStruct } from "../../../cards/media-player-card/struct";
import { MediaPlayerEntity } from "../../../types/ha/entity";
import { presets } from "./constants";
import { enumToOptions } from "../../helpers";
import { CardFeaturePosition } from "../../../cards/types";
import { Position, TopRowPositions } from "../../../lib/layout/position";

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
        @value-changed=${(ev) => this._handleValueChanged("entity", ev)}
        .hass=${this.hass}
      ></ha-selector>
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCursorMove}></ha-svg-icon>
          <span>${t("editor.card.media_player.label.layout")}</span>
        </h3>
        <div class="content flex-col">
          <bc-layout-select
            .label=${t("editor.card.media_player.label.picture_position")}
            .value=${this._config.picture_position}
            .positions=${[
              ...TopRowPositions,
              Position.MIDDLE_LEFT,
              Position.MIDDLE_RIGHT,
            ]}
            @value-changed=${(ev) =>
              this._handleValueChanged("picture_position", ev)}
          ></bc-layout-select>
          <ha-selector
            .selector=${{
              boolean: {},
            }}
            .label=${t("editor.card.media_player.label.hide_picture")}
            .value=${this._config?.hide_picture ?? false}
            @value-changed=${(ev) =>
              this._handleValueChanged("hide_picture", ev)}
            .hass=${this.hass}
          ></ha-selector>
          <bc-layout-select
            .label=${t("editor.card.media_player.label.text_position")}
            .value=${this._config.text_position}
            @value-changed=${(ev) =>
              this._handleValueChanged("text_position", ev)}
            .hass=${this.hass}
          ></bc-layout-select>
          <ha-selector
            .selector=${{
              boolean: {},
            }}
            .label=${t("editor.card.media_player.label.hide_text")}
            .value=${this._config?.hide_text ?? false}
            @value-changed=${(ev) => this._handleValueChanged("hide_text", ev)}
          ></ha-selector>
          <ha-selector
            .selector=${{
              select: {
                mode: "dropdown",
                options: enumToOptions(MediaPlayerCardBackgroundPictureStyle, {
                  labelScope:
                    "common.media_player_card_background_picture_style",
                }),
              },
            }}
            .label=${t("editor.card.media_player.label.background_picture")}
            .value=${this._config?.background_picture ??
            CardFeaturePosition.BOTTOM}
            @value-changed=${(ev) =>
              this._handleValueChanged("background_picture", ev)}
            .hass=${this.hass}
          ></ha-selector>
          <ha-selector
            .selector=${{
              select: {
                mode: "box",
                options: enumToOptions(CardFeaturePosition, {
                  labelScope: "common.card_feature_position",
                  image: (value) => ({
                    src: `/static/images/form/tile_features_position_${value}.svg`,
                    src_dark: `/static/images/form/tile_features_position_${value}_dark.svg`,
                    flip_rtl: true,
                  }),
                }),
              },
            }}
            .label=${t("editor.card.media_player.label.feature_position")}
            .value=${this._config?.feature_position ??
            CardFeaturePosition.BOTTOM}
            @value-changed=${(ev) =>
              this._handleValueChanged("feature_position", ev)}
            .hass=${this.hass}
          ></ha-selector>
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
