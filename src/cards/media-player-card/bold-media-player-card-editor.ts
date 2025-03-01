import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardContentLayout,
  MediaPlayerTileConfig,
} from "./types";
import { customElement, property, state } from "lit/decorators";
import { assert } from "superstruct";
import { cardConfigStruct } from "./struct";
import {
  mdiButtonPointer,
  mdiListBox,
  mdiPageLayoutBody,
  mdiPageLayoutHeader,
  mdiPalette,
  mdiStar,
} from "@mdi/js";
import { MediaPlayerProgressControlFeature } from "../../features/media-player-progress-control/media-player-progress-control";
import { MediaPlayerControlButtonRowFeature } from "../../features/media-player-control-button-row/media-player-control-button-row";
import { t } from "../../localization/i18n";
import { HomeAssistant, LovelaceCardEditor } from "../../types/ha/lovelace";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaButtonControlConfig,
} from "../../lib/controls/types";
import { editorBaseStyles } from "../../editors/styles";
import { ButtonShape, ButtonSize } from "../../components/bc-button";

const presets = [
  {
    name: "Horizontal Default",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    },
  },
  {
    name: "Horizontal Artwork Background",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 3,
        columns: 12,
      },
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    },
  },
  {
    name: "Horizontal Artwork Background Space",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 12,
      },
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    },
  },
  {
    name: "Artwork Square",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 4,
        columns: 6,
      },
      features: [],
    },
  },
  {
    name: "Artwork Square Large",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_ON,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.TURN_OFF,
          size: ButtonSize.MD,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 7,
        columns: 12,
      },
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    },
  },
  {
    name: "Vertical Full",
    config: {
      controls: [],
      content_layout: MediaPlayerCardContentLayout.VERTICAL,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: false,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
        {
          type: "media-player-volume-slider",
        },
      ],
    },
  },
  {
    name: "Vertical Full Artwork Background",
    config: {
      controls: [],
      content_layout: MediaPlayerCardContentLayout.VERTICAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: false,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
        {
          type: "media-player-volume-slider",
        },
      ],
    },
  },
  {
    name: "Horizontal Full Artwork Background",
    config: {
      controls: [],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.PICTURE,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        rows: 9,
        columns: 12,
      },
      features: [
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          full_width: true,
          show_timestamps: true,
          controls: [],
        },
        MediaPlayerControlButtonRowFeature.getStubConfig(),
        {
          type: "media-player-volume-slider",
        },
      ],
    },
  },
  {
    name: "Simple Play/Pause",
    config: {
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
          size: ButtonSize.MD,
          shape: ButtonShape.ROUNDED,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
          size: ButtonSize.MD,
          shape: ButtonShape.SQUARE,
          when_unavailable: ElementWhenUnavailable.HIDE,
        },
      ],
      content_layout: MediaPlayerCardContentLayout.HORIZONTAL,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      grid_options: {
        columns: 12,
      },
      features: [],
    },
  },
] satisfies {
  name: string;
  config: Partial<MediaPlayerTileConfig>;
}[];

@customElement("bold-media-player-card-editor")
export class BoldMediaPlayerCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: MediaPlayerTileConfig;

  public setConfig(config: MediaPlayerTileConfig): void {
    assert(config, cardConfigStruct);
    this._config = config;
  }

  protected render() {
    if (!this.hass) {
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
