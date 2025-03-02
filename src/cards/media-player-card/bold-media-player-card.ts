import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { fireEvent, LovelaceCardEditor } from "custom-card-helpers";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardContentLayout,
  MediaPlayerTileConfig,
} from "./types";
import { HomeAssistant, LovelaceGridOptions } from "../../types/ha/lovelace";
import { PropertyValues } from "lit-element";
import { extractColors } from "../../helpers/extract-color";
import { styleMap } from "lit-html/directives/style-map";
import {
  getMediaDescription,
  handleMediaPlayerAction,
} from "../../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";
import { MediaControlButtonActionEvent } from "../../components/bc-media-control-button-row";
import { MediaPlayerProgressControlFeature } from "../../features/media-player-progress-control/media-player-progress-control";
import { BoldCardWithFeatures } from "../base";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { MediaPlayerControlButtonRowFeature } from "../../features/media-player-control-button-row/media-player-control-button-row";
import { mediaPlayerCardStyles } from "./style";

import { ControlType, MediaButtonAction } from "../../lib/controls/types";
import { translateControls } from "../../lib/controls/helpers";
import { ButtonShape, ButtonSize } from "../../components/bc-button";
import { isMediaPlayerEntity, isStateActive } from "../../helpers/states";

@customElement("bold-media-player-card")
export class BoldMediaPlayerCard extends BoldCardWithFeatures<
  MediaPlayerTileConfig,
  MediaPlayerEntity
> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./bold-media-player-card-editor");
    return document.createElement(
      "bold-media-player-card-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MediaPlayerTileConfig {
    const entity = getStubEntity(hass);

    return {
      type: "custom:bold-media-player-card",
      entity: entity?.entity_id ?? "",
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
      features: [MediaPlayerProgressControlFeature.getStubConfig()],
    };
  }

  public setConfig(originalConfig: MediaPlayerTileConfig) {
    // set default values for undefined properties
    const config = { show_title_bar: true, ...originalConfig };

    if (
      config.content_layout === MediaPlayerCardContentLayout.VERTICAL &&
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

  @state() private _hasLoadedImage = false;

  protected _getSizeWithoutFeatures() {
    return this._config?.content_layout ===
      MediaPlayerCardContentLayout.VERTICAL
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
      MediaPlayerCardColorMode.MANUAL
    ) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
        return this._foregroundColor;
      case MediaPlayerCardColorMode.PICTURE:
        return this._foregroundColor;
      default:
        return `var(--${this._config!.color}-color)`;
    }
  }

  private get _backgroundColorCSS() {
    switch (
      (this._backgroundColor ? this._config?.color_mode : undefined) ??
      MediaPlayerCardColorMode.MANUAL
    ) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
        return `color-mix(in srgb, ${this._backgroundColor}, var(--card-background-color) 95%)`;
      case MediaPlayerCardColorMode.PICTURE:
        return this._backgroundColor;
      default:
        return "var(--card-background-color)";
    }
  }

  private get _textColorCSS() {
    switch (
      (this._foregroundColor ? this._config?.color_mode : undefined) ??
      MediaPlayerCardColorMode.MANUAL
    ) {
      case MediaPlayerCardColorMode.PICTURE:
        return "color-mix(in srgb, white, var(--tile-color) 20%)";
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
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

    const controls = translateControls({
      controls: this._config.controls,
      stateObj,
    });

    const renderBackgroundImage =
      this._config?.color_mode === MediaPlayerCardColorMode.PICTURE;

    const renderCoverImage = !renderBackgroundImage && this._hasLoadedImage;

    const renderingFeatures = this._renderingFeatures;

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
            MediaPlayerCardContentLayout.VERTICAL,
        })}
      >
        <div
          class="background"
          @click=${this._handleMoreInfo}
          role="button"
          tabindex="0"
          aria-labelledby="info"
        >
          ${renderBackgroundImage
            ? html`<div
                class="background-image ${classMap({
                  hidden: !this._hasLoadedImage,
                })}"
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
              ${renderCoverImage
                ? html`<div class="image"><img src=${imageUrl}></img></div>`
                : nothing}
              <div class="media-info" id="info">
                <span class="primary">${mediaTitle || mediaDescription}</span>
                ${mediaTitle
                  ? html`<span class="secondary">${mediaDescription}</span>`
                  : nothing}
              </div>
              ${controls.length > 0
                ? html`<bc-media-control-button-row
                    .controls=${controls}
                    @action=${this._handleAction}
                  ></bc-media-control-button-row>`
                : nothing}
            </div>
          </div>
          ${renderingFeatures.length > 0
            ? html`<hui-card-features
                .hass=${this.hass}
                .stateObj=${stateObj}
                .features=${renderingFeatures}
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
      this._hasLoadedImage = false;
      return;
    }

    const swatches = await extractColors(this.hass!.hassUrl(this._imageUrl));
    const darkMode =
      this.hass?.selectedTheme?.dark ??
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    switch (this._config?.color_mode) {
      case MediaPlayerCardColorMode.AMBIENT:
        this._foregroundColor = darkMode
          ? swatches.LightVibrant?.hex
          : swatches.DarkMuted?.hex;
        this._backgroundColor = darkMode
          ? swatches.DarkMuted?.hex
          : swatches.LightVibrant?.hex;
        break;
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
        this._foregroundColor = darkMode
          ? swatches.LightVibrant?.hex
          : swatches.DarkVibrant?.hex;
        this._backgroundColor = darkMode
          ? swatches.Vibrant?.hex
          : swatches.LightVibrant?.hex;
        break;
      case MediaPlayerCardColorMode.PICTURE:
        this._foregroundColor = swatches.LightVibrant?.hex;
        this._backgroundColor = swatches.DarkMuted?.hex;
        break;
    }

    this._hasLoadedImage = true;
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

  static get styles() {
    return mediaPlayerCardStyles;
  }
}

BoldMediaPlayerCard.registerCustomCard({
  type: "bold-media-player-card",
  name: "Bold Media Player",
  description: "A media player card that's bold and beautiful.",
  preview: true,
});

function getStubEntity(hass: HomeAssistant) {
  const entities = Object.values(hass.states).filter(isMediaPlayerEntity);

  if (entities.length === 0) {
    return undefined;
  }

  const activeEntities = entities.filter(isStateActive);

  return activeEntities.length > 0
    ? activeEntities[Math.floor(Math.random() * activeEntities.length)]
    : entities[Math.floor(Math.random() * entities.length)];
}
