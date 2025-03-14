import { state } from "lit/decorators";
import { BoldCardWithInlineFeatures } from "../base";
import {
  BoldMediaPlayerCardBaseConfig,
  MediaPlayerCardColorMode,
} from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { HomeAssistant } from "../../types/ha/lovelace";
import { getMediaDescription } from "../../helpers/media-player";
import { PropertyValues } from "lit-element";
import { extractColors } from "../../helpers/extract-color";
import { fireEvent } from "custom-card-helpers";
import { isMediaPlayerEntity, isStateActive } from "../../helpers/states";
import { randomFrom } from "../../lib/helpers";
import { t } from "../../localization/i18n";

export abstract class BoldMediaPlayerCardBase<
  TConfig extends BoldMediaPlayerCardBaseConfig = BoldMediaPlayerCardBaseConfig,
> extends BoldCardWithInlineFeatures<TConfig, MediaPlayerEntity> {
  @state() private _foregroundColor?: string;

  @state() private _backgroundColor?: string;

  @state() protected _hasLoadedImage = false;

  protected get _childStateObj() {
    return this.getUniversalMediaPlayerChildStateObj(
      this._stateObj,
      this._config?.universal_media_player_enhancements,
    );
  }

  protected get _imageUrl() {
    const stateObj = this._stateObj;
    return (
      stateObj?.attributes.entity_picture_local ??
      stateObj?.attributes.entity_picture
    );
  }

  protected get _foregroundColorCSS() {
    switch (this._foregroundColor ? this._config?.color_mode : undefined) {
      case MediaPlayerCardColorMode.AMBIENT:
      case MediaPlayerCardColorMode.AMBIENT_VIBRANT:
      case MediaPlayerCardColorMode.AMBIENT_SOLID:
        return this._foregroundColor;
      default:
        return `var(--${this._config?.color}-color)`;
    }
  }

  protected get _backgroundColorCSS() {
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

  protected get _textColorCSS() {
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

  protected get _mediaTitle() {
    const stateObj = this._stateObj;

    if (!stateObj) {
      return "";
    }

    return stateObj.attributes.media_title
      ? stateObj.attributes.media_title
      : getMediaDescription(stateObj);
  }

  protected get _mediaDescription() {
    const stateObj = this._stateObj;

    if (!stateObj) {
      return "";
    }

    return stateObj.attributes.media_title
      ? getMediaDescription(stateObj)
      : t(stateObj.state, {
          scope: "common.entity_state",
          defaultValue: stateObj.state,
        });
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

  protected _handleMoreInfo() {
    fireEvent(this, "hass-more-info", {
      entityId: this._config!.entity,
    });
  }
}

export function getStubMediaPlayerEntity(hass: HomeAssistant) {
  const entities = Object.values(hass.states).filter(isMediaPlayerEntity);

  if (entities.length === 0) {
    return undefined;
  }

  const activeEntities = entities.filter(isStateActive);

  return activeEntities.length > 0
    ? randomFrom(activeEntities)
    : randomFrom(entities);
}
