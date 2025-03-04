import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { MediaPlayerEntityFeature } from "../helpers/media-player";
import { MediaPlayerEntity } from "../types/ha/entity";
import { supportsFeature } from "../helpers/supports-feature";

export const MediaPositionTimestampPosition = {
  HIDDEN: "hidden",
  INLINE: "inline",
  BOTTOM: "bottom",
};
export type MediaPositionTimestampPosition =
  (typeof MediaPositionTimestampPosition)[keyof typeof MediaPositionTimestampPosition];

@customElement("bc-media-position-control")
export class MediaPositionControl extends LitElement {
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  @property() public timestampPosition?: MediaPositionTimestampPosition;

  render() {
    if (!this.stateObj) {
      return nothing;
    }

    const supportsSeek = supportsFeature(
      this.stateObj,
      MediaPlayerEntityFeature.SEEK,
    );

    const mediaPosition = this.stateObj!.attributes.media_position;
    const mediaDuration = this.stateObj!.attributes.media_duration;

    const mediaPositionLabel = formatDuration(mediaPosition);
    const mediaDurationLabel = formatDuration(mediaDuration);

    return html`
      <div class="container">
        ${supportsSeek
          ? html`<div class="slider-container">
              ${this.timestampPosition === MediaPositionTimestampPosition.BOTTOM
                ? html`<time class="position">${mediaPositionLabel}</time>`
                : nothing}
              <ha-slider
                min=${0}
                max=${mediaDuration}
                value=${mediaPosition}
              ></ha-slider>
              ${this.timestampPosition === MediaPositionTimestampPosition.BOTTOM
                ? html`<time class="duration">${mediaDurationLabel}</time>`
                : nothing}
            </div>`
          : html`<div class="slider-placeholder"></div>`}
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: var(--feature-height, 42px);
        border-radius: var(--feature-border-radius, 12px);
      }

      .slider-container {
        flex: 1;
        position: relative;
        height: var(--feature-height, 42px);
        display: flex;
        align-items: center;
      }
        
      .slider-placeholder {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: rgb(from var(--tile-color) r g b / 20%);
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

export function formatDuration(durationSeconds: number | undefined) {
  if (durationSeconds === undefined) {
    return "0:00";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
