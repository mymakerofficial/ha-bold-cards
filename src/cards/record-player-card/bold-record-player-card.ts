import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { GetFeatureInternalsContext } from "../../types/card";
import {
  BoldMediaPlayerCardBase,
  getStubMediaPlayerEntity,
} from "../media-player-card/base";
import { HomeAssistant, LovelaceGridOptions } from "../../types/ha/lovelace";
import { MediaPlayerState } from "../../types/ha/entity";
import { BoldMediaPlayerControlRowFeature } from "../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaToggleKind,
} from "../../lib/controls/types";
import { styleMap } from "lit-html/directives/style-map";
import {
  MediaPlayerCardColorMode,
  MediaPlayerTileConfig,
} from "../media-player-card/types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { FeatureInternals } from "../../lib/internals/types";

function getFeatureInternals(
  context: GetFeatureInternalsContext,
): FeatureInternals {
  return {
    parent_card_type: context.config?.type ?? "",
    is_inlined: true,
  };
}

@customElement("bold-record-player-card")
export class BoldRecordPlayerCard extends BoldMediaPlayerCardBase {
  public static getStubConfig(hass: HomeAssistant) {
    const entity = getStubMediaPlayerEntity(hass);

    return {
      type: "custom:bold-record-player-card",
      entity: entity?.entity_id ?? "",
    };
  }

  public setConfig(config: MediaPlayerTileConfig) {
    super.setConfig({
      ...config,
      color_mode: MediaPlayerCardColorMode.AMBIENT,
      features: [
        {
          ...BoldMediaPlayerControlRowFeature.getStubConfig(),
          when_unavailable: ElementWhenUnavailable.HIDE,
          controls: [
            {
              type: ControlType.MEDIA_TOGGLE,
              kind: MediaToggleKind.PLAY_PAUSE,
              media_pause: {
                variant: ButtonVariant.FILLED,
                shape: ButtonShape.SQUARE,
                size: ButtonSize.MD,
              },
              media_play: {
                variant: ButtonVariant.FILLED,
                shape: ButtonShape.ROUND,
                size: ButtonSize.MD,
              },
              when_unavailable: ElementWhenUnavailable.HIDE,
              unavailable_when_off: true,
            },
          ],
        },
      ],
    });
  }

  protected _getFeatureInternals(
    context: GetFeatureInternalsContext,
  ): FeatureInternals {
    return getFeatureInternals(context);
  }

  protected _getShouldRenderInlineFeature(): boolean {
    return true;
  }

  protected _getSizeWithoutFeatures(): number {
    return 1;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      rows: 4,
      min_columns: 6,
      min_rows: 2,
    };
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

    const imageUrl = this._imageUrl;
    const mediaTitle = this._mediaTitle;
    const mediaDescription = this._mediaDescription;

    const playing = stateObj.state === MediaPlayerState.PLAYING;

    const features = this._getRenderingInlineFeatures();

    return html`
      <div
        class="container"
        style=${styleMap({
          "--tile-color": this._foregroundColorCSS,
          "--ha-card-background": this._backgroundColorCSS,
          color: this._textColorCSS,
        })}
      >
        <div class="media-info" id="info">
          <span class="primary"
            >${mediaTitle || stateObj.attributes.friendly_name}</span
          >
          ${mediaTitle
            ? html`<span class="secondary">${mediaDescription}</span>`
            : nothing}
        </div>
        <div class="content">
          <div
            class="background"
            @click=${this._handleMoreInfo}
            role="button"
            tabindex="0"
            aria-labelledby="info"
          >
            ${this._hasLoadedImage
              ? html`
                  <div class="image">
                    <img
                      data-animating=${playing}
                      src=${imageUrl}
                      alt=${this._mediaTitle}
                    />
                  </div>
                `
              : nothing}
            <ha-ripple></ha-ripple>
          </div>
          <hui-card-features
            .hass=${this.hass}
            .stateObj=${stateObj}
            .features=${features}
          ></hui-card-features>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      [role="button"] {
        cursor: pointer;
        pointer-events: auto;
      }

      [role="button"]:focus {
        outline: none;
      }

      .container {
        --tile-color: var(--primary-color);
        --tile-icon-color: var(--tile-color);
        --state-color: var(--tile-color);
        --state-icon-color: var(--tile-color);
        --ha-ripple-color: var(--tile-color);
        --ha-ripple-hover-opacity: 0.04;
        --ha-ripple-pressed-opacity: 0.12;
      }

      .container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column-reverse;
        justify-content: center;
        align-items: center;
        gap: 16px;
      }

      .content {
        position: relative;
        height: 100%;
        aspect-ratio: 1 / 1;
      }

      .background {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        overflow: hidden;
        background-color: var(--ha-card-background);
        mask-image: radial-gradient(
          circle at center,
          rgba(0, 0, 0, 0) 4%,
          rgba(0, 0, 0, 1) 4.5%,
          rgba(0, 0, 0, 1) 100%
        );
        transition:
          box-shadow 180ms ease-in-out,
          border-color 180ms ease-in-out,
          color 180ms ease-in-out,
          background-color 180ms ease-in-out;
      }

      .background:focus-visible {
        box-shadow: 0 0 0 2px var(--tile-color) !important;
      }

      .media-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        min-height: 52px;
        max-width: 100%;
        background: var(--ha-card-background);
        color: var(--primary-text-color);
        align-items: center;
        padding: 0 42px;
        border-radius: 52px;
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

      .image {
        padding: 2%;
        pointer-events: none;
      }

      .image img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        mask-image: radial-gradient(
          circle at center,
          rgba(0, 0, 0, 0) 15%,
          rgba(0, 0, 0, 1) 15.5%,
          rgba(0, 0, 0, 1) 100%
        );
      }

      .image img[data-animating="true"] {
        animation: spin 30s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      hui-card-features {
        position: absolute;
        bottom: 0;
        right: 0;
        width: fit-content;
      }
    `;
  }
}

BoldRecordPlayerCard.registerCustomCard({
  type: "bold-record-player-card",
  name: "Bold Record Player",
  description: "A media player with flair.",
  preview: true,
  getFeatureInternals,
});
