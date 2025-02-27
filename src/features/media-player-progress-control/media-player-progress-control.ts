import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { MediaPlayerProgressControlFeatureConfig } from "./types";
import {
  getMediaControls,
  handleMediaPlayerAction,
  MediaControlAction,
  MediaPlayerEntityFeature,
} from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { classMap } from "lit-html/directives/class-map";
import { ButtonSize, ButtonVariant } from "../../components/mpt-button";
import { supportsFeature } from "../../helpers/supports-feature";
import { formatDuration } from "./helper";
import { MediaControlButtonActionEvent } from "../../components/mpt-media-control-button-row";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { HassEntity } from "home-assistant-js-websocket";

@customElement("media-player-progress-control")
export class MediaPlayerProgressControlFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  MediaPlayerProgressControlFeatureConfig
> {
  static getStubConfig(): MediaPlayerProgressControlFeatureConfig {
    return {
      type: "custom:media-player-progress-control",
      full_width: true,
      show_timestamps: false,
      controls: Object.values(MediaControlAction),
    };
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    if (!supportsFeature(this.stateObj, MediaPlayerEntityFeature.SEEK)) {
      return nothing;
    }

    const controls = getMediaControls(this.stateObj!)
      .filter(({ action }) => this._config?.controls?.includes(action))
      .map((it) => ({
        ...it,
        size: ButtonSize.SM,
        variant: ButtonVariant.PLAIN,
      }));

    const left = controls.filter(({ action }) =>
      [
        MediaControlAction.TURN_ON,
        MediaControlAction.TURN_OFF,
        MediaControlAction.SHUFFLE_SET,
        MediaControlAction.MEDIA_PREVIOUS_TRACK,
      ].includes(action),
    );

    const right = controls.filter(({ action }) =>
      [
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
        MediaControlAction.MEDIA_NEXT_TRACK,
        MediaControlAction.REPEAT_SET,
      ].includes(action),
    );

    const mediaPosition = this.stateObj!.attributes.media_position;
    const mediaDuration = this.stateObj!.attributes.media_duration;

    const mediaPositionLabel = formatDuration(mediaPosition);
    const mediaDurationLabel = formatDuration(mediaDuration);

    const showTimestamps =
      this._config!.show_timestamps && mediaPosition && mediaDuration;

    return html`
      <div
        class="container ${classMap({
          "full-width": !!this._config!.full_width,
        })}"
      >
        <mpt-media-control-button-row
          .controls=${left}
          @action="${this._handleAction}"
        ></mpt-media-control-button-row>
        <div class="slider-container">
          ${showTimestamps
            ? html`<time class="position">${mediaPositionLabel}</time>`
            : nothing}
          <ha-slider
            min=${0}
            max=${mediaDuration}
            value=${mediaPosition}
          ></ha-slider>
          ${showTimestamps
            ? html`<time class="duration">${mediaDurationLabel}</time>`
            : nothing}
        </div>
        <mpt-media-control-button-row
          .controls=${right}
          @action="${this._handleAction}"
        ></mpt-media-control-button-row>
      </div>
    `;
  }

  private _handleAction(event: MediaControlButtonActionEvent) {
    handleMediaPlayerAction({
      hass: this.hass!,
      stateObj: this.stateObj!,
      action: event.detail.action,
    }).then();
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: var(--feature-height, 42px);
        width: 80%;
        margin: 0 auto;
        border-radius: var(--feature-border-radius, 12px);
      }

      .container.full-width {
        width: unset;
        /* make the icon align and not the border of the button */
        /* TODO: what if the outer button has a background? */
        margin: 0 calc(-1 * var(--card-padding, 10px) + 6px);
      }

      .slider-container {
        flex: 1;
        position: relative;
        height: var(--feature-height, 42px);
        display: flex;
        align-items: center;
      }

      ha-slider {
        width: 100%;
        --md-sys-color-primary: var(--tile-color);
        --md-focus-ring-color: var(--tile-color);
        --_inactive-track-color: rgb(from var(--tile-color) r g b / 20%);
      }

      .slider-container time {
        position: absolute;
        bottom: 0;
        font-size: 0.7em;
        line-height: 1;
        margin: 0 8px;
        opacity: 0.5;
      }

      .slider-container time.position {
        left: 2px;
      }
        
      .slider-container time.duration {
        right: 2px;
    `;
  }
}

MediaPlayerProgressControlFeature.registerCustomFeature<
  MediaPlayerEntity,
  MediaPlayerProgressControlFeatureConfig
>({
  type: "media-player-progress-control",
  name: "Media Player Progress",
  supported: (stateObj: HassEntity) =>
    computeDomain(stateObj.entity_id) === "media_player",
  doesRender: (_config, stateObj) =>
    supportsFeature(stateObj, MediaPlayerEntityFeature.SEEK),
  configurable: false,
});
