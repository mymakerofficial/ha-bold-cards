import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import {
  MediaPlayerCardHorizontalAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
  MediaPlayerTileConfig,
  MediaPlayerCardVerticalAlignment,
} from "../../../cards/media-player-card/types";
import { customElement } from "lit/decorators";
import { mdiCursorMove, mdiPalette, mdiStar, mdiTextShort } from "@mdi/js";
import { t } from "../../../localization/i18n";
import { MediaButtonControlConfig } from "../../../lib/controls/types";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithFeatures } from "../base";
import { mediaPlayerCardConfigStruct } from "../../../cards/media-player-card/struct";
import { MediaPlayerEntity } from "../../../types/ha/entity";
import { presets } from "./constants";
import { enumToOptions } from "../../helpers";
import { CardFeaturePosition } from "../../../cards/types";

@customElement("bold-media-player-card-editor")
export class BoldMediaPlayerCardEditor extends BoldLovelaceCardEditorWithFeatures<
  MediaPlayerTileConfig,
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

    const entityId = this._config?.entity;
    const stateObj = entityId ? this.hass?.states[entityId] : undefined;

    const schema = [
      {
        name: "entity",
        selector: { entity: { domain: "media_player" } },
      },
      {
        name: "layout",
        flatten: true,
        type: "expandable",
        iconPath: mdiCursorMove,
        schema: [
          {
            name: "picture_position",
            required: true,
            selector: {
              select: {
                mode: "box",
                options: enumToOptions(MediaPlayerCardPicturePosition, {
                  labelScope: "common.media_player_card_picture_position",
                }),
              },
            },
          },
          {
            name: "info_alignment",
            required: true,
            selector: {
              select: {
                mode: "box",
                options: enumToOptions(MediaPlayerCardHorizontalAlignment, {
                  labelScope: "common.media_player_card_horizontal_alignment",
                }),
              },
            },
          },
          {
            name: "content_alignment",
            required: true,
            selector: {
              select: {
                mode: "box",
                options: enumToOptions(MediaPlayerCardVerticalAlignment, {
                  labelScope: "common.media_player_card_vertical_alignment",
                }),
              },
            },
          },
          {
            name: "feature_position",
            required: true,
            selector: {
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
            },
          },
        ],
      },
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
      ${this._controlsEditorTemplate()}
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
