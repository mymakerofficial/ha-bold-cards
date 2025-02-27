import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import {
  MediaPlayerTileColorMode,
  MediaPlayerTileConfig,
  MediaPlayerTileContentLayout,
} from "./types";
import { HomeAssistant, LovelaceGridOptions } from "../../types/ha/lovelace";
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
import { MediaPlayerEntity } from "../../types/ha/entity";
import { MediaPlayerControlButtonRowFeature } from "../../features/media-player-control-button-row/media-player-control-button-row";

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "media-player-tile",
  name: "Media Player Tile",
  description: "A template custom card for you to create something awesome",
});

@customElement("media-player-tile")
export class MediaPlayerTileCard extends CustomLovelaceCard<
  MediaPlayerTileConfig,
  MediaPlayerEntity
> {
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
      color_mode: MediaPlayerTileColorMode.AMBIENT_VIBRANT,
      color: "primary",
      show_title_bar: true,
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    };
  }

  public setConfig(originalConfig: MediaPlayerTileConfig) {
    // set default values for undefined properties
    const config = { show_title_bar: true, ...originalConfig };

    if (
      config.content_layout === MediaPlayerTileContentLayout.VERTICAL &&
      config.controls?.length
    ) {
      // move controls to feature row because its easier to measure the height there
      super.setConfig({
        ...config,
        controls: [],
        features: [
          {
            ...MediaPlayerControlButtonRowFeature.getStubConfig(),
            controls: config.controls,
          },
          ...(config.features ?? []),
        ],
      });
      return;
    }

    super.setConfig(config);
  }

  @state() private _foregroundColor?: string;

  @state() private _backgroundColor?: string;

  protected _getSizeWithoutFeatures() {
    return this._config?.content_layout ===
      MediaPlayerTileContentLayout.VERTICAL
      ? 5
      : 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      rows: this._getSizeWithoutFeatures() + this._getTotalFeatureSize(),
      min_columns: 6,
      min_rows: this._getSizeWithoutFeatures() + this._getTotalFeatureSize(),
    };
  }

  private get _imageUrl() {
    const stateObj = this._stateObj;
    return (
      stateObj?.attributes.entity_picture_local ??
      stateObj?.attributes.entity_picture
    );
  }

  private get _foregroundColorCSS() {
    switch (
      (this._foregroundColor ? this._config?.color_mode : undefined) ??
      MediaPlayerTileColorMode.MANUAL
    ) {
      case MediaPlayerTileColorMode.AMBIENT:
      case MediaPlayerTileColorMode.AMBIENT_VIBRANT:
        return this._foregroundColor;
      case MediaPlayerTileColorMode.PICTURE:
        return this._foregroundColor;
      default:
        return `var(--${this._config!.color}-color)`;
    }
  }

  private get _backgroundColorCSS() {
    switch (
      (this._backgroundColor ? this._config?.color_mode : undefined) ??
      MediaPlayerTileColorMode.MANUAL
    ) {
      case MediaPlayerTileColorMode.AMBIENT:
      case MediaPlayerTileColorMode.AMBIENT_VIBRANT:
        return `color-mix(in srgb, ${this._backgroundColor}, var(--card-background-color) 95%)`;
      case MediaPlayerTileColorMode.PICTURE:
        return this._backgroundColor;
      default:
        return "var(--card-background-color)";
    }
  }

  private get _textColorCSS() {
    switch (
      (this._foregroundColor ? this._config?.color_mode : undefined) ??
      MediaPlayerTileColorMode.MANUAL
    ) {
      case MediaPlayerTileColorMode.PICTURE:
        return "color-mix(in srgb, white, var(--tile-color) 20%)";
      case MediaPlayerTileColorMode.AMBIENT:
      case MediaPlayerTileColorMode.AMBIENT_VIBRANT:
        return "color-mix(in srgb, var(--primary-text-color), var(--tile-color) 20%)";
      default:
        return "inherit";
    }
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const stateObj = this._stateObj;
    const imageUrl = this._imageUrl;

    if (!stateObj) {
      // TODO show error or something
      return nothing;
    }

    const mediaTitle = stateObj.attributes.media_title
      ? stateObj.attributes.media_title
      : getMediaDescription(stateObj);
    const mediaDescription = stateObj.attributes.media_title
      ? getMediaDescription(stateObj)
      : stateObj.state;

    const controls = getMediaControls(stateObj).filter(({ action }) =>
      this._config?.controls?.includes(action),
    );

    const showBackgroundImage =
      this._config?.color_mode === MediaPlayerTileColorMode.PICTURE &&
      !!imageUrl;

    const showCoverImage =
      !showBackgroundImage &&
      (!!imageUrl ||
        this._config.content_layout === MediaPlayerTileContentLayout.VERTICAL);

    return html`
      <ha-card
        style=${styleMap({
          "--tile-color": this._foregroundColorCSS,
          "--ha-card-background": this._backgroundColorCSS,
          color: this._textColorCSS,
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
          ${showBackgroundImage
            ? html`<div
                class="background-image"
                style=${styleMap({
                  "background-image": imageUrl ? `url(${imageUrl})` : "",
                })}
              ></div>`
            : nothing}
          <ha-ripple></ha-ripple>
        </div>
        <div class="container">
          <div class="content">
            ${this._config.show_title_bar
              ? html`<div class="title-bar">
                  <div class="player-title">
                    <ha-state-icon
                      .stateObj=${stateObj}
                      .hass=${this.hass}
                    ></ha-state-icon>
                    <span>${this._stateObj?.attributes.friendly_name}</span>
                  </div>
                </div>`
              : nothing}
            <div class="header">
              ${showCoverImage
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
          ${this._getRenderedFeatureSize() > 0
            ? html`<hui-card-features
                .hass=${this.hass}
                .stateObj=${stateObj}
                .features=${this._config.features}
                style=${styleMap({
                  "--feature-height":
                    "calc(var(--row-height) + var(--row-gap) - var(--card-padding))",
                  "--feature-padding": "calc(var(--card-padding))",
                })}
              ></hui-card-features>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    this._updateColors().then();
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

    switch (this._config?.color_mode) {
      case MediaPlayerTileColorMode.AMBIENT:
        this._foregroundColor = darkMode
          ? swatches.LightVibrant?.hex
          : swatches.DarkMuted?.hex;
        this._backgroundColor = darkMode
          ? swatches.DarkMuted?.hex
          : swatches.LightVibrant?.hex;
        break;
      case MediaPlayerTileColorMode.AMBIENT_VIBRANT:
        this._foregroundColor = darkMode
          ? swatches.LightVibrant?.hex
          : swatches.DarkVibrant?.hex;
        this._backgroundColor = darkMode
          ? swatches.Vibrant?.hex
          : swatches.LightVibrant?.hex;
        break;
      case MediaPlayerTileColorMode.PICTURE:
        this._foregroundColor = swatches.LightVibrant?.hex;
        this._backgroundColor = swatches.DarkMuted?.hex;
        break;
    }
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
        overflow: hidden;
      }

      .background-image {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-position: center;
        background-size: cover;
        mask-image: radial-gradient(
          circle at center,
          rgba(0, 0, 0, 0.8) 15%,
          rgba(0, 0, 0, 0.1) 80%,
          rgba(0, 0, 0, 0) 100%
        );
        max-height: calc(var(--row-height) * 6 + var(--row-gap) * 5);
      }

      .background-image::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          to top,
          var(--ha-card-background) 0%,
          transparent 50%
        );
        min-height: calc(var(--row-height) * 6 + var(--row-gap) * 5);
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
        margin-top: auto;
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
        font-size: 1.05rem;
        font-weight: 500;
      }

      .media-info .secondary {
        font-size: 0.8rem;
        font-weight: 400;
        opacity: 0.9;
      }

      ha-card.vertical .media-info {
        width: 100%;
        align-items: center;
        gap: 8px;
      }

      ha-card.vertical .media-info .primary {
        font-size: 1.4rem;
        font-weight: 400;
      }

      ha-card.vertical .media-info .secondary {
        font-size: 0.9rem;
        font-weight: 400;
      }
    `;
  }
}
