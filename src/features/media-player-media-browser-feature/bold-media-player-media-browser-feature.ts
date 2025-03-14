import { customElement, state } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerMediaBrowserFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { PropertyValues } from "lit-element";
import { MediaPlayerItem } from "../../lib/media-player/media-browser";
import { repeat } from "lit-html/directives/repeat";
import { styleMap } from "lit-html/directives/style-map";

@customElement("bold-media-player-media-browser")
export class BoldMediaPlayerMediaBrowserFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  BoldMediaPlayerMediaBrowserFeatureConfig
> {
  @state() private _currentItem?: MediaPlayerItem;

  static getStubConfig(): BoldMediaPlayerMediaBrowserFeatureConfig {
    return {
      type: "custom:bold-media-player-media-browser",
    };
  }

  protected get _childStateObj() {
    const config =
      this._config?.universal_media_player_enhancements ??
      this._internals?.universal_media_player_enhancements;
    return this.getUniversalMediaPlayerChildStateObj(this.stateObj, config);
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    let shouldUpdate = false;

    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as this["hass"];
      const newHass = this.hass;
      shouldUpdate = oldHass?.localize !== newHass?.localize;
    }

    if (changedProps.has("stateObj")) {
      const oldStateObj = changedProps.get("stateObj") as this["stateObj"];
      const newStateObj = this.stateObj;
      shouldUpdate =
        oldStateObj === undefined ||
        oldStateObj?.attributes.active_child !==
          newStateObj?.attributes.active_child;
    }

    if (changedProps.has("_currentItem")) {
      shouldUpdate = true;
    }

    return shouldUpdate;
  }

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (
      !changedProperties.has("stateObj") ||
      changedProperties.has("_currentItem")
    ) {
      return;
    }

    const stateObj = this._childStateObj;

    if (!stateObj) {
      return;
    }

    this.browseMediaPlayer(
      stateObj.entity_id,
      "current_user_saved_albums",
      "spotify://current_user_saved_albums",
    ).then((item) => {
      this._currentItem = item;
    });
  }

  protected _handleClickItem(item: MediaPlayerItem) {
    if (!this.hass || !this.stateObj) {
      return;
    }

    this.hass
      .callService("media_player", "play_media", {
        entity_id: this.stateObj.entity_id,
        media_content_id: item.media_content_id,
        media_content_type: item.media_content_type,
      })
      .then();
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    const items = (this._currentItem?.children ?? []).slice(0, 4);

    return html`
      <div
        class="container"
        style=${styleMap({
          "--feature-size": 2,
        })}
      >
        ${items.length === 0
          ? html`<div class="placeholder"><span>Nothing to show</span></div>`
          : nothing}
        ${repeat(
          items,
          (item) => item.media_content_id,
          (item) => html`
            <div class="item">
              <div class="thumbnail">
                <img src=${item.thumbnail} alt="" />
              </div>
              <button aria-label=${`Play ${item.title}`} @click=${() => this._handleClickItem(item)}>
              <ha-ripple></ha-ripple>
            </div>
          `,
        )}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --feature-background: color-mix(
          in srgb,
          var(--ha-card-background),
          var(--lovelace-background) 80%
        );
        --ha-ripple-hover-opacity: 0.1;
        --ha-ripple-pressed-opacity: 0.12;
        position: relative;
      }

      * {
        box-sizing: border-box;
      }

      *:focus {
        outline: none;
      }

      .container {
        position: relative;
        height: calc(
          var(--feature-height) * var(--feature-size) + var(--feature-gap) *
            (var(--feature-size) - 1)
        );
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
        justify-content: space-between;
        justify-items: center;
        align-items: center;
        gap: var(--feature-gap);
        background: var(--feature-background);
        border-radius: calc(
          var(--ha-card-border-radius, 12px) - var(--feature-gap) / 2
        );
        overflow: hidden;
        padding: 0 var(--feature-gap);
      }

      .placeholder {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8rem;
        font-weight: 400;
        opacity: 0.9;
      }

      .item {
        width: min-content;
        position: relative;
        border-radius: calc(var(--ha-card-border-radius, 12px) / 3);
        overflow: hidden;
        transition: box-shadow 180ms ease-in-out;
      }

      .item:has(:focus-visible) {
        box-shadow: 0 0 0 2px var(--tile-color);
      }

      .thumbnail {
        height: calc(
          var(--feature-height) * var(--feature-size) - var(--feature-gap)
        );
        aspect-ratio: 1 / 1;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }
}

BoldMediaPlayerMediaBrowserFeature.registerCustomFeature<
  MediaPlayerEntity,
  BoldMediaPlayerMediaBrowserFeatureConfig
>({
  type: "bold-media-player-media-browser",
  name: "Media Player Media Browser",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (_config, _stateObj) => 2,
  configurable: false,
});
