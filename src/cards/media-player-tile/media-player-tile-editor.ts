import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import {
  HomeAssistant,
  fireEvent,
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
import { mdiPalette } from "@mdi/js";

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

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

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
                    label: "Manual",
                    value: MediaPlayerTileColorMode.MANUAL,
                  },
                ],
              },
            },
          },
          {
            name: "color",
            selector: {
              ui_color: {
                default_color: "state",
                // include_state: true,
              },
            },
          },
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
        color: "Color",
        content_layout: "Layout",
      }[schema.name] ?? ""
    );
  };

  private _computeHelperCallback = (schema: { name: string }) => {
    // TODO Add translations
    return (
      {
        color: 'Only applicable when "Color Mode" is set to "Manual"',
      }[schema.name] ?? ""
    );
  };

  static styles: CSSResultGroup = css``;
}
