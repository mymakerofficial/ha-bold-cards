import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import {
  MediaPlayerTileColorMode,
  MediaPlayerTileConfig,
  MediaPlayerTileContentLayout,
} from "./types";
import { HomeAssistant, LovelaceGridOptions } from "../../types/ha/lovelace";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { PropertyValues } from "lit-element";
import { extractColors } from "../../helpers/extract-color";
import { styleMap } from "lit-html/directives/style-map";
import {
  getMediaControls,
  getMediaDescription,
  handleMediaPlayerAction,
  MediaControlAction,
} from "../../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";
import { MediaControlButtonActionEvent } from "../../components/mpt-media-control-button-row";
import { MediaPlayerProgressControlFeature } from "../../features/media-player-progress-control/media-player-progress-control";
import { CustomLovelaceCard } from "../base";
import { computeDomain } from "../../helpers/entity";

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "media-player-tile",
  name: "Media Player Tile",
  description: "A template custom card for you to create something awesome",
});

@customElement("media-player-tile")
export class MediaPlayerTileCard extends CustomLovelaceCard<MediaPlayerTileConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./media-player-tile-editor");
    return document.createElement(
      "media-player-tile-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MediaPlayerTileConfig {
    const entities = Object.keys(hass.states).filter(
      (entity_id) => computeDomain(entity_id) === "media_player",
    );
    const entity = entities[Math.floor(Math.random() * entities.length)];

    return {
      type: "custom:media-player-tile",
      entity,
      controls: [
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
      ],
      content_layout: MediaPlayerTileContentLayout.HORIZONTAL,
      color_mode: MediaPlayerTileColorMode.AMBIENT,
      color: "primary",
      features: [
        {
          ...MediaPlayerProgressControlFeature.getStubConfig(),
          controls: [
            MediaControlAction.SHUFFLE_SET,
            MediaControlAction.MEDIA_PREVIOUS_TRACK,
            MediaControlAction.MEDIA_NEXT_TRACK,
            MediaControlAction.REPEAT_SET,
          ],
        },
      ],
    };
  }

  @state() private _foregroundColor?: string;

  @state() private _backgroundColor?: string;

  public getCardSize(): number {
    return (
      (this._config?.content_layout === MediaPlayerTileContentLayout.VERTICAL
        ? 5
        : 2) + this._getFeatureTotalSize()
    );
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: "full",
      rows: this.getCardSize(),
      min_columns: 6,
      min_rows: this.getCardSize(),
    };
  }

  private get _stateObj() {
    const entityId = this._config!.entity;
    return this.hass!.states[entityId] as MediaPlayerEntity | undefined;
  }

  private get _imageUrl() {
    const stateObj = this._stateObj;
    return (
      stateObj?.attributes.entity_picture_local ??
      stateObj?.attributes.entity_picture
    );
  }

  private get _tileColor() {
    return this._config!.color_mode === MediaPlayerTileColorMode.AMBIENT
      ? this._foregroundColor || `var(--${this._config!.color}-color)`
      : `var(--${this._config!.color}-color)`;
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const stateObj = this._stateObj;

    if (!stateObj) {
      // TODO show error or something
      return nothing;
    }

    const mediaTitle = stateObj.attributes.media_title;
    const mediaDescription = stateObj.attributes.media_title
      ? getMediaDescription(stateObj)
      : stateObj.state;
    const imageUrl = this._imageUrl;

    const controls = getMediaControls(stateObj).filter(({ action }) =>
      this._config?.controls?.includes(action),
    );

    return html`
      <ha-card
        style=${styleMap({
          "--tile-color": this._tileColor,
          "--ha-card-background":
            this._config!.color_mode === MediaPlayerTileColorMode.AMBIENT &&
            this._backgroundColor
              ? `color-mix(in srgb, ${this._backgroundColor}, var(--card-background-color) 95%)`
              : "",
        })}
        class=${classMap({
          vertical:
            this._config.content_layout ===
            MediaPlayerTileContentLayout.VERTICAL,
        })}
      >
        <div
          class="background"
          @click=${this._handleMoreInfo}
          role="button"
          tabindex="0"
          aria-labelledby="info"
        >
          <ha-ripple></ha-ripple>
        </div>
        <div class="container">
          <div class="content">
            <div class="title-bar">
              <div class="player-title">
                <ha-state-icon
                  .stateObj=${stateObj}
                  .hass=${this.hass}
                ></ha-state-icon>
                <span>${this._stateObj?.attributes.friendly_name}</span>
              </div>
            </div>
            <div class="header">
              ${imageUrl ||
              this._config.content_layout ===
                MediaPlayerTileContentLayout.VERTICAL
                ? html`<mpt-cover-image .imageUrl=${imageUrl}>
                    <ha-state-icon
                      slot="icon"
                      .stateObj=${stateObj}
                      .hass=${this.hass}
                    ></ha-state-icon>
                  </mpt-cover-image>`
                : nothing}
              <div class="media-info" id="info">
                <span class="primary">${mediaTitle || mediaDescription}</span>
                ${mediaTitle
                  ? html`<span class="secondary">${mediaDescription}</span>`
                  : nothing}
              </div>
              ${controls
                ? html`<mpt-media-control-button-row
                    .controls=${controls}
                    @action=${this._handleAction}
                  ></mpt-media-control-button-row>`
                : nothing}
            </div>
          </div>
          <hui-card-features
            .hass=${this.hass}
            .stateObj=${stateObj}
            .features=${this._config.features}
            style=${styleMap({
              "--feature-height":
                "calc(var(--row-height) + var(--row-gap) - var(--card-padding))",
              "--feature-padding": "calc(var(--card-padding))",
            })}
          ></hui-card-features>
        </div>
      </ha-card>
    `;
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (this._config!.color_mode === MediaPlayerTileColorMode.AMBIENT) {
      this._updateColors().then();
    }
  }

  private async _updateColors() {
    if (!this._imageUrl) {
      this._foregroundColor = undefined;
      this._backgroundColor = undefined;
      return;
    }

    const swatches = await extractColors(this.hass!.hassUrl(this._imageUrl));
    const darkMode =
      this.hass?.selectedTheme?.dark ??
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    this._foregroundColor = darkMode
      ? swatches.LightVibrant?.hex
      : swatches.DarkMuted?.hex;
    this._backgroundColor = darkMode
      ? swatches.Vibrant?.hex
      : swatches.LightVibrant?.hex;
  }

  private _handleAction(event: MediaControlButtonActionEvent) {
    handleMediaPlayerAction({
      hass: this.hass!,
      stateObj: this._stateObj!,
      action: event.detail.action,
    }).then();
  }

  private _handleMoreInfo() {
    fireEvent(this, "hass-more-info", {
      entityId: this._config!.entity,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        -webkit-tap-highlight-color: transparent;
        --card-padding: 16px;
      }

      ha-card {
        --tile-color: var(--primary-color);
        --tile-icon-color: var(--tile-color);
        --state-color: var(--tile-color);
        --state-icon-color: var(--tile-color);
        --ha-ripple-color: var(--tile-color);
        --ha-ripple-hover-opacity: 0.04;
        --ha-ripple-pressed-opacity: 0.12;
        height: 100%;
        transition:
          box-shadow 180ms ease-in-out,
          border-color 180ms ease-in-out,
          color 180ms ease-in-out,
          background-color 180ms ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      ha-card:has(.background:focus-visible) {
        box-shadow: 0 0 0 2px var(--tile-color) !important;
      }

      .background {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      [role="button"] {
        cursor: pointer;
        pointer-events: auto;
      }

      [role="button"]:focus {
        outline: none;
      }

      .container {
        margin: calc(-1 * var(--ha-card-border-width, 1px));
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .content {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: var(--card-padding);
        min-width: 0;
        overflow: hidden;
        pointer-events: none;
        min-height: calc(
          var(--row-height) * 2 + var(--row-gap) - var(--card-padding) * 2
        );
      }

      ha-card.vertical .content {
        min-height: calc(
          var(--row-height) * 5 + var(--row-gap) * 4 - var(--card-padding) * 2
        );
      }

      .title-bar {
        display: flex;
        align-items: start;
        justify-content: space-between;
      }

      .player-title {
        display: flex;
        gap: 8px;
        border-radius: 12px;
        --mdc-icon-size: 14px;
        font-size: 0.8em;
        font-weight: 500;
      }

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--card-padding);
        min-width: 0;
        box-sizing: border-box;
        pointer-events: none;
      }

      ha-card.vertical .header {
        padding-top: var(--card-padding);
        flex-direction: column;
        justify-content: center;
        width: 100%;
        gap: 24px;
      }

      mpt-media-control-button-row {
        pointer-events: all;
        margin-top: auto;
      }

      mpt-cover-image {
        --image-size: 53px;
      }

      ha-card.vertical mpt-cover-image {
        --image-size: 148px;
      }

      .media-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }

      .media-info * {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        max-width: 100%;
      }

      .media-info .primary {
        font-weight: 500;
      }

      .media-info .secondary {
        font-size: 12px;
        font-weight: 400;
      }

      ha-card.vertical .media-info {
        width: 100%;
        align-items: center;
        gap: 8px;
      }

      ha-card.vertical .media-info .primary {
        font-size: 18px;
        font-weight: 400;
      }
    `;
  }
}
