import { html, nothing } from "lit";
import { customElement } from "lit/decorators";
import {
  BoldMediaPlayerCardConfig,
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
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
import { GetFeatureInternalsContext } from "../../types/card";
import { BoldMediaPlayerCardBase, getStubMediaPlayerEntity } from "./base";
import { t } from "../../localization/i18n";
import { isMediaPlayerStateActive } from "../../helpers/states";
import { FeatureInternals } from "../../lib/internals/types";
import { BoldCardType } from "../../lib/cards/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { doIfDefined, pair } from "../../lib/helpers";
import {
  InlinePosition,
  isInlinePosition,
  Position,
  splitPosition,
  VerticalPosition,
} from "../../lib/layout/position";

function getFeatureInternals(
  context: GetFeatureInternalsContext<BoldMediaPlayerCardConfig>,
): FeatureInternals {
  return {
    parent_card_type: context.config?.type ?? "",
    is_inlined:
      context.featureIndex === 0 &&
      isInlinePosition(context.config?.feature_position),
    is_first: context.featureIndex === 0,
    is_last: context.featureIndex === context.features.length - 1,
    universal_media_player_enhancements:
      context.config?.universal_media_player_enhancements,
  };
}

const cardType = BoldCardType.MEDIA_PLAYER;

@customElement(stripCustomPrefix(cardType))
export class BoldMediaPlayerCard extends BoldMediaPlayerCardBase<BoldMediaPlayerCardConfig> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import(
      "../../editors/cards/media-player-card/bold-media-player-card-editor"
    );
    return document.createElement(
      "bold-media-player-card-editor",
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  public static getStubConfig(
    hass: HomeAssistant,
    entities: string[],
    entitiesFallback: string[],
  ): BoldMediaPlayerCardConfig {
    const entity = getStubMediaPlayerEntity(hass, entities, entitiesFallback);

    return {
      type: this.cardType,
      entity: entity?.entity_id ?? "",
      picture_position: InlinePosition.INLINE_LEFT,
      show_picture: false,
      background_picture: MediaPlayerCardBackgroundPictureStyle.COVER,
      text_position: Position.BOTTOM_LEFT,
      feature_position: VerticalPosition.BOTTOM,
      color_mode: MediaPlayerCardColorMode.AMBIENT_VIBRANT,
      placeholder_when_off: true,
      ...presets[0].config,
    };
  }

  public setConfig(config: BoldMediaPlayerCardConfig) {
    super.setConfig({
      color: "primary",
      show_picture: true,
      show_text: true,
      show_title_bar: true,
      ...config,
    });
  }

  protected _getFeatureInternals(
    context: GetFeatureInternalsContext<BoldMediaPlayerCardConfig>,
  ): FeatureInternals {
    return getFeatureInternals(context);
  }

  protected _getShouldRenderInlineFeature(): boolean {
    return isInlinePosition(this._config?.feature_position);
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
      case Position.TOP_LEFT:
      case Position.TOP_CENTER:
      case Position.TOP_RIGHT:
        return 4;
      default:
        return 2;
    }
  }

  private get _maxImageSize() {
    return this._contentSize + 1;
  }

  private get _heroLayout() {
    const [vertical, horizontal] = doIfDefined(
      splitPosition,
      this._config?.picture_position,
      pair(undefined, undefined),
    );

    if (vertical === VerticalPosition.MIDDLE) {
      return horizontal;
    }

    return "vertical";
  }

  private get _imageContainerLayout() {
    const [vertical, horizontal] = doIfDefined(
      splitPosition,
      this._config?.picture_position,
      pair(undefined, undefined),
    );

    if (vertical === VerticalPosition.TOP) {
      return horizontal;
    }

    return "center";
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const stateObj = this._stateObj;
    const childStateObj = this._childStateObj;
    const imageUrl = this._imageUrl;

    if (!stateObj || !childStateObj) {
      // TODO show error or something
      return nothing;
    }

    const mediaTitle = this._mediaTitle;
    const mediaDescription = this._mediaDescription;

    const renderBackgroundImage =
      this._config?.background_picture ===
      MediaPlayerCardBackgroundPictureStyle.COVER;

    const renderHeroImage = this._config?.show_picture && this._hasLoadedImage;

    const inlineFeatures = this._getRenderingInlineFeatures();
    const bottomFeatures = this._getRenderingBottomFeatures();

    const heroLayout = this._heroLayout;
    const imageContainerLayout = this._imageContainerLayout;
    const [verticalAlign, horizontalAlign] = doIfDefined(
      splitPosition,
      this._config?.text_position,
      pair(undefined, undefined),
    );

    const showNoMedia = this._config?.placeholder_when_off
      ? !isMediaPlayerStateActive(stateObj.state)
      : false;

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
          ${!showNoMedia
            ? html` <div class="content">
                ${this._config.show_title_bar
                  ? html`<div class="title-bar">
                      <div class="player-title">
                        <ha-state-icon
                          .stateObj=${childStateObj}
                          .hass=${this.hass}
                        ></ha-state-icon>
                        <span>${childStateObj.attributes.friendly_name}</span>
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
                          <div class="image">
                            <img src=${imageUrl} alt="" />
                          </div>
                        </div>
                      `
                    : nothing}
                  <div class="media-info-container">
                    <div
                      class="media-info ${classMap({
                        "visually-hidden": !this._config.show_text,
                      })}"
                      id="info"
                      data-horizontal-align=${horizontalAlign}
                    >
                      <span class="primary"
                        >${mediaTitle || mediaDescription}</span
                      >
                      ${mediaTitle
                        ? html`<span class="secondary"
                            >${mediaDescription}</span
                          >`
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
              </div>`
            : html`<div class="no-media-content">
                <div class="title-bar">
                  <div class="player-title">
                    <ha-state-icon
                      .stateObj=${childStateObj}
                      .hass=${this.hass}
                    ></ha-state-icon>
                    <span>${childStateObj.attributes.friendly_name}</span>
                  </div>
                </div>
                <div class="no-media-info" id="info">
                  ${t("card.media_player.label.no_media", {
                    state: t(stateObj.state, {
                      scope: "common.entity_state",
                    }).toLowerCase(),
                    entity: stateObj.attributes.friendly_name,
                  })}
                </div>
              </div> `}
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
  name: "Bold Media Player",
  description: "A media player card that's bold and beautiful.",
  preview: true,
  getFeatureInternals,
});
