import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { fireEvent } from "custom-card-helpers";
import {
  MediaPlayerCardHorizontalAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
  MediaPlayerTileConfig,
  MediaPlayerCardVerticalAlignment,
} from "./types";
import {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { PropertyValues } from "lit-element";
import { extractColors } from "../../helpers/extract-color";
import { styleMap } from "lit-html/directives/style-map";
import { getMediaDescription } from "../../helpers/media-player";
import { classMap } from "lit-html/directives/class-map";
import { BoldCardWithInlineFeatures } from "../base";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { mediaPlayerCardStyles } from "./style";
import { isMediaPlayerEntity, isStateActive } from "../../helpers/states";
import { randomFrom } from "../../lib/helpers";
import { presets } from "../../editors/cards/media-player-card/constants";
import { CardFeaturePosition } from "../types";
import { GetFeatureInternalsContext } from "../../types/card";
import { FeatureInternals } from "../../types/ha/feature";

function getFeatureInternals(
  context: GetFeatureInternalsContext,
): FeatureInternals {
  return {
    parent_card_type: context.config?.type ?? "",
    is_inlined:
      context.featureIndex === 0 &&
      context.config?.feature_position === CardFeaturePosition.INLINE,
  };
}

@customElement("bold-media-player-card")
export class BoldMediaPlayerCard extends BoldCardWithInlineFeatures<
  MediaPlayerTileConfig,
  MediaPlayerEntity
> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(
      "../../editors/cards/media-player-card/bold-media-player-card-editor"
    );
    return document.createElement(
      "bold-media-player-card-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MediaPlayerTileConfig {
    const entity = getStubEntity(hass);

    return {
      type: "custom:bold-media-player-card",
      entity: entity?.entity_id ?? "",
      picture_position: MediaPlayerCardPicturePosition.BACKGROUND,
      horizontal_alignment: MediaPlayerCardHorizontalAlignment.LEFT,
      vertical_alignment: MediaPlayerCardVerticalAlignment.BOTTOM,
      feature_position: CardFeaturePosition.INLINE,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      ...presets[0].config,
    };
  }

  public setConfig(config: MediaPlayerTileConfig) {
    super.setConfig({
      color: "primary",
      show_title_bar: true,
      ...config,
    });
  }

  @state() private _foregroundColor?: string;

  @state() private _backgroundColor?: string;

  @state() private _hasLoadedImage = false;

  protected _getFeatureInternals(
    context: GetFeatureInternalsContext,
  ): FeatureInternals {
    return getFeatureInternals(context);
  }

  protected _getShouldRenderInlineFeature(): boolean {
    return this._config?.feature_position === CardFeaturePosition.INLINE;
  }

  protected _getSizeWithoutFeatures() {
    return this._contentSize;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      rows: this._getSizeWithoutFeatures() + this._getTotalBottomFeatureSize(),
      min_columns: 6,
      min_rows:
        this._getSizeWithoutFeatures() + this._getTotalBottomFeatureSize(),
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
    switch (this._foregroundColor ? this._config?.color_mode : undefined) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
      case MediaPlayerCardColorMode.AMBIENT_SOLID:
        return this._foregroundColor;
      default:
        return `var(--${this._config?.color}-color)`;
    }
  }

  private get _backgroundColorCSS() {
    switch (this._backgroundColor ? this._config?.color_mode : undefined) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
        return `color-mix(in srgb, ${this._backgroundColor}, var(--card-background-color) 95%)`;
      case MediaPlayerCardColorMode.AMBIENT_SOLID:
        return this._backgroundColor;
      default:
        return "var(--card-background-color)";
    }
  }

  private get _textColorCSS() {
    switch (this._foregroundColor ? this._config?.color_mode : undefined) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
        return "color-mix(in srgb, var(--primary-text-color), var(--tile-color) 20%)";
      case MediaPlayerCardColorMode.AMBIENT_SOLID:
        return "color-mix(in srgb, white, var(--tile-color) 20%)";
      default:
        return "inherit";
    }
  }

  private get _contentSize() {
    switch (this._config?.picture_position) {
      case MediaPlayerCardPicturePosition.TOP_LEFT:
      case MediaPlayerCardPicturePosition.TOP_CENTER:
      case MediaPlayerCardPicturePosition.TOP_RIGHT:
        return 4;
      default:
        return 2;
    }
  }

  private get _maxImageSize() {
    return this._contentSize + 1;
  }

  private get _heroLayout() {
    switch (this._config?.picture_position) {
      case MediaPlayerCardPicturePosition.INLINE_LEFT:
        return "left";
      case MediaPlayerCardPicturePosition.INLINE_RIGHT:
        return "right";
      case MediaPlayerCardPicturePosition.TOP_LEFT:
      case MediaPlayerCardPicturePosition.TOP_CENTER:
      case MediaPlayerCardPicturePosition.TOP_RIGHT:
        return "vertical";
      default:
        return "";
    }
  }

  private get _imageContainerLayout() {
    switch (this._config?.picture_position) {
      case MediaPlayerCardPicturePosition.TOP_LEFT:
        return "left";
      case MediaPlayerCardPicturePosition.TOP_RIGHT:
        return "right";
      default:
        return "center";
    }
  }

  private get _horizontalAlign() {
    return this._config?.horizontal_alignment;
  }

  private get _verticalAlign() {
    return this._config?.vertical_alignment;
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

    const renderBackgroundImage =
      this._config?.picture_position ===
      MediaPlayerCardPicturePosition.BACKGROUND;

    const renderHeroImage =
      !renderBackgroundImage &&
      this._config?.picture_position !== MediaPlayerCardPicturePosition.HIDE &&
      this._hasLoadedImage;

    const inlineFeatures = this._getRenderingInlineFeatures();
    const bottomFeatures = this._getRenderingBottomFeatures();

    const heroLayout = this._heroLayout;
    const imageContainerLayout = this._imageContainerLayout;
    const horizontalAlign = this._horizontalAlign;
    const verticalAlign = this._verticalAlign;

    return html`
      <ha-card
        style=${styleMap({
          "--tile-color": this._foregroundColorCSS,
          "--ha-card-background": this._backgroundColorCSS,
          color: this._textColorCSS,
          "--content-size": this._contentSize,
          "--max-image-size": this._maxImageSize,
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
            <div
              class="hero"
              data-layout=${heroLayout}
              data-vertical-align=${verticalAlign}
            >
              ${renderHeroImage
                ? html`
                    <div
                      class="image-container"
                      data-layout=${imageContainerLayout}
                    >
                      <div class="image"><img src=${imageUrl} alt="" /></div>
                    </div>
                  `
                : nothing}
              <div class="media-info-container">
                <div
                  class="media-info"
                  id="info"
                  data-horizontal-align=${horizontalAlign}
                >
                  <span class="primary">${mediaTitle || mediaDescription}</span>
                  ${mediaTitle
                    ? html`<span class="secondary">${mediaDescription}</span>`
                    : nothing}
                </div>
                ${inlineFeatures.length > 0
                  ? html`<hui-card-features
                      .hass=${this.hass}
                      .stateObj=${stateObj}
                      .features=${inlineFeatures}
                      style=${styleMap({
                        gap: "0px",
                        width: "min-content",
                      })}
                    ></hui-card-features>`
                  : nothing}
              </div>
            </div>
          </div>
          ${bottomFeatures.length > 0
            ? html`<hui-card-features
                .hass=${this.hass}
                .stateObj=${stateObj}
                .features=${bottomFeatures}
                style=${styleMap({
                  "--feature-height":
                    "calc(var(--row-height) + var(--row-gap) - var(--card-padding))",
                  "--feature-gap": "var(--card-padding)",
                  gap: "var(--feature-gap)",
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
      case MediaPlayerCardColorMode.AMBIENT_SOLID:
        this._foregroundColor = swatches.LightVibrant?.hex;
        this._backgroundColor = swatches.DarkMuted?.hex;
        break;
    }

    this._hasLoadedImage = true;
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
  getFeatureInternals,
});

function getStubEntity(hass: HomeAssistant) {
  const entities = Object.values(hass.states).filter(isMediaPlayerEntity);

  if (entities.length === 0) {
    return undefined;
  }

  const activeEntities = entities.filter(isStateActive);

  return activeEntities.length > 0
    ? randomFrom(activeEntities)
    : randomFrom(entities);
}
