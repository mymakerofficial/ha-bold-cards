import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, nothing, unsafeCSS } from "lit";
import { MediaPlayerEntity, MediaPlayerState } from "../types/ha/entity";
import { PropertyValues } from "lit-element";

// TODO: replace with shared Position enum
export const MediaPositionTimestampPosition = {
  HIDDEN: "hidden",
  INLINE: "inline",
  BOTTOM: "bottom",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
} as const;
export type MediaPositionTimestampPosition =
  (typeof MediaPositionTimestampPosition)[keyof typeof MediaPositionTimestampPosition];

@customElement("bc-media-position-control")
export class MediaPositionControl extends LitElement {
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  @property({ type: Boolean }) public disabled = false;
  @property() public timestampPosition?: MediaPositionTimestampPosition;

  private _interval: number | null = null;

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (this.stateObj?.state === MediaPlayerState.PLAYING) {
      if (this._interval === null) {
        this._interval = window.setInterval(() => {
          this.requestUpdate();
        }, 1000);
      }
    } else {
      if (this._interval !== null) {
        clearInterval(this._interval);
        this._interval = null;
      }
    }
  }

  render() {
    if (!this.stateObj) {
      return nothing;
    }

    const mediaPosition = getMediaPosition(this.stateObj);
    const mediaDuration = this.stateObj!.attributes.media_duration;

    const mediaPositionLabel = formatDuration(mediaPosition);
    const mediaDurationLabel = formatDuration(mediaDuration);

    const showTimestamps =
      this.timestampPosition !== undefined &&
      !(
        [
          MediaPositionTimestampPosition.HIDDEN,
          MediaPositionTimestampPosition.BOTTOM_LEFT,
          MediaPositionTimestampPosition.BOTTOM_RIGHT,
        ] as string[]
      ).includes(this.timestampPosition);

    const showCombinedTimestamps =
      this.timestampPosition !== undefined &&
      (
        [
          MediaPositionTimestampPosition.BOTTOM_LEFT,
          MediaPositionTimestampPosition.BOTTOM_RIGHT,
        ] as string[]
      ).includes(this.timestampPosition);

    return html`
      <div class="container">
        ${!this.disabled
          ? html`
              ${showTimestamps
                ? html`<time data-position=${this.timestampPosition}
                    >${mediaPositionLabel}</time
                  >`
                : nothing}
              ${showCombinedTimestamps
                ? html`<time data-position=${this.timestampPosition}
                    >${mediaPositionLabel} / ${mediaDurationLabel}</time
                  >`
                : nothing}
              <ha-slider
                min=${0}
                max=${mediaDuration}
                value=${mediaPosition}
              ></ha-slider>
              ${showTimestamps
                ? html`<time data-position=${this.timestampPosition}
                    >${mediaDurationLabel}</time
                  >`
                : nothing}
            `
          : html`<div class="slider-placeholder"></div>`}
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: var(--feature-height, 42px);
        border-radius: var(--feature-border-radius, 12px);
        margin: 0 -10px;
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

      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM)}"], 
      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM_LEFT)}"],
      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM_RIGHT)}"]
      {
        position: absolute;
        bottom: 0;
        font-size: 0.7em;
        line-height: 1;
        margin: 0 8px;
        opacity: 0.5;
      }
        
      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM_LEFT)}"] {
        left: 2px;
      }
        
      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM_RIGHT)}"] {
        right: 2px;
      }

      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.INLINE)}"] {
        color: var(--tile-color);
        font-size: 0.8em;
        font-weight: 500;
        line-height: 1;
        opacity: 0.8;
      }

      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM)}"]:first-child {
        left: 2px;
      }
        
      time[data-position="${unsafeCSS(MediaPositionTimestampPosition.BOTTOM)}"]:last-child {
        right: 2px;
    `;
  }
}

function getMediaPosition(stateObj: MediaPlayerEntity) {
  if (!stateObj.attributes.media_position) {
    return 0;
  }

  if (!stateObj.attributes.media_position_updated_at) {
    return stateObj.attributes.media_position;
  }

  const now = Date.now();
  const updatedAt = new Date(
    stateObj.attributes.media_position_updated_at,
  ).getTime();
  const diff = now - updatedAt;

  return stateObj.attributes.media_position + diff / 1000;
}

export function formatDuration(durationSeconds: number | undefined) {
  if (durationSeconds === undefined) {
    return "0:00";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
