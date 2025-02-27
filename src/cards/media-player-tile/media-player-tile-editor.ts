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
import { mdiPageLayoutHeader, mdiPalette } from "@mdi/js";

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
      <ha-alert alert-type="info" title="Heads up!">
        This card is still in early development. Head to the YAML editor for
        more settings.
      </ha-alert>
    `;
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
  `;
}
