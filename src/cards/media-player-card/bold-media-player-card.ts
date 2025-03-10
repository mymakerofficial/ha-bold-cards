import { html, nothing } from "lit";
import { customElement } from "lit/decorators";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardHorizontalAlignment,
  MediaPlayerCardPicturePosition,
  MediaPlayerCardVerticalAlignment,
  MediaPlayerTileConfig,
} from "./types";
import {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { styleMap } from "lit-html/directives/style-map";
import { classMap } from "lit-html/directives/class-map";
import { mediaPlayerCardStyles } from "./style";
import { presets } from "../../editors/cards/media-player-card/constants";
import { CardFeaturePosition } from "../types";
import { GetFeatureInternalsContext } from "../../types/card";
import { FeatureInternals } from "../../types/ha/feature";
import { BoldMediaPlayerCardBase, getStubMediaPlayerEntity } from "./base";

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
export class BoldMediaPlayerCard extends BoldMediaPlayerCardBase<MediaPlayerTileConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(
      "../../editors/cards/media-player-card/bold-media-player-card-editor"
    );
    return document.createElement(
      "bold-media-player-card-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(hass: HomeAssistant): MediaPlayerTileConfig {
    const entity = getStubMediaPlayerEntity(hass);

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

  protected get _imageUrl() {
    const stateObj = this._stateObj;
    return (
      stateObj?.attributes.entity_picture_local ??
      stateObj?.attributes.entity_picture
    );
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

    const mediaTitle = this._mediaTitle;
    const mediaDescription = this._mediaDescription;

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
