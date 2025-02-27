import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import {
  fireEvent,
  HomeAssistant,
  LovelaceCardEditor,
} from "custom-card-helpers";
import {
  MediaPlayerTileColorMode,
  MediaPlayerTileConfig,
  MediaPlayerTileContentLayout,
} from "./types";
import { customElement, property, state } from "lit/decorators";
import { assert } from "superstruct";
import { cardConfigStruct } from "./struct";
import { mdiListBox, mdiPageLayoutHeader, mdiPalette } from "@mdi/js";
import { MediaPlayerProgressControlFeature } from "../../features/media-player-progress-control/media-player-progress-control";
import { MediaControlAction } from "../../helpers/media-player";
import { MediaPlayerControlButtonRowFeature } from "../../features/media-player-control-button-row/media-player-control-button-row";

const presets = [
  {
    name: "Horizontal Default",
    config: {
      controls: [
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
      ],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.AMBIENT_VIBRANT,
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
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
      ],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
      ],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
      controls: [MediaControlAction.MEDIA_PLAY, MediaControlAction.MEDIA_PAUSE],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
      ],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
      content_layout: MediaPlayerTileContentLayout.VERTICAL,
      color_mode: MediaPlayerTileColorMode.AMBIENT_VIBRANT,
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
      content_layout: MediaPlayerTileContentLayout.VERTICAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.PICTURE,
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
      controls: [MediaControlAction.MEDIA_PLAY, MediaControlAction.MEDIA_PAUSE],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.AMBIENT_VIBRANT,
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

@customElement("media-player-tile-editor")
export class MediaPlayerTileEditor
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

    const entityId = this._config!.entity;
    const stateObj = entityId ? this.hass!.states[entityId] : undefined;

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
                    value: MediaPlayerTileContentLayout.HORIZONTAL,
                  },
                  {
                    label: "Vertical",
                    value: MediaPlayerTileContentLayout.VERTICAL,
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
                        value: MediaPlayerTileColorMode.AMBIENT,
                      },
                      {
                        label: "Ambient Vibrant",
                        value: MediaPlayerTileColorMode.AMBIENT_VIBRANT,
                      },
                      {
                        label: "Picture Background",
                        value: MediaPlayerTileColorMode.PICTURE,
                      },
                      {
                        label: "Fixed Color",
                        value: MediaPlayerTileColorMode.MANUAL,
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
          <ha-svg-icon .path=${mdiListBox}></ha-svg-icon>
          Presets
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
      <ha-alert alert-type="info" title="Heads up!">
        This card is still in early development. Head to the YAML editor for
        more settings.
      </ha-alert>
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

  private _computeLabelCallback = (schema: { name: string }) => {
    // TODO Add translations
    return (
      {
        entity: "Entity",
        appearance: "Appearance",
        color_mode: "Color Mode",
        color: "Fallback Color",
        content_layout: "Layout",
        title_bar: "Title Bar",
        show_title_bar: "Show Title Bar",
      }[schema.name] ?? ""
    );
  };

  private _computeHelperCallback = (schema: { name: string }) => {
    // TODO Add translations
    return (
      {
        color:
          'Only applicable when "Color Mode" is set to "Fixed Color", or no artwork is available.',
        show_title_bar: "Show the media player's name.",
      }[schema.name] ?? ""
    );
  };

  static styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    ha-expansion-panel {
      display: block;
      --expansion-panel-content-padding: 0;
      border-radius: 6px;
      --ha-card-border-radius: 6px;
    }
    ha-expansion-panel .content {
      padding: 12px;
    }
  `;
}
