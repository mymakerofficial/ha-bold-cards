import { css } from "lit";

export const mediaPlayerCardStyles = css`
  [role="button"] {
    cursor: pointer;
    pointer-events: auto;
  }

  [role="button"]:focus {
    outline: none;
  }

  :host {
    -webkit-tap-highlight-color: transparent;
    --card-padding: 16px;
  }

  ha-card {
    --tile-color: var(--primary-color);
    --tile-icon-color: var(--tile-color);
    --state-color: var(--tile-color);
    --state-icon-color: var(--tile-color);
    --ha-ripple-color: var(--tile-color);
    --ha-ripple-hover-opacity: 0.04;
    --ha-ripple-pressed-opacity: 0.12;
  }

  ha-card {
    height: 100%;
    padding: var(--card-padding);
    transition:
      box-shadow 180ms ease-in-out,
      border-color 180ms ease-in-out,
      color 180ms ease-in-out,
      background-color 180ms ease-in-out;
  }

  ha-card:has(.background:focus-visible) {
    box-shadow: 0 0 0 2px var(--tile-color) !important;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-position: center;
    background-size: cover;
    mask-image: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.8) 15%,
      rgba(0, 0, 0, 0.1) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    max-height: calc(var(--row-height) * 6 + var(--row-gap) * 5);
    opacity: 1;
    transition: opacity 180ms ease-in-out;
  }

  .background-image::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(
      to top,
      var(--ha-card-background) 0%,
      transparent 50%
    );
    min-height: calc(var(--row-height) * 6 + var(--row-gap) * 5);
    opacity: 1;
    transition: opacity 180ms ease-in-out;
  }

  .background-image.hidden,
  .background-image.hidden:after {
    opacity: 0;
  }

  .container {
    /* container is the only element (that's not the background) 
            flex 1 means it will take up all the space */
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--card-padding);
    margin: calc(-1 * var(--ha-card-border-width, 1px));
  }

  .content {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--card-padding);
    overflow: hidden;
    /* allow interaction with .background */
    pointer-events: none;
    min-height: calc(
      var(--row-height) * var(--content-size) + var(--row-gap) *
        (var(--content-size) - 1) - var(--card-padding) * 2
    );
  }

  .title-bar {
    display: flex;
    align-items: start;
    justify-content: space-between;
  }

  .player-title {
    display: flex;
    gap: 8px;
    border-radius: 12px;
    --mdc-icon-size: 14px;
    font-size: 0.8em;
    font-weight: 500;
  }

  .hero {
    flex: 1;
    display: flex;
    gap: var(--card-padding);
    min-height: 0;
    min-width: 0;
    box-sizing: border-box;
    pointer-events: none;
  }

  .hero[data-layout="left"] {
    flex-direction: row;
  }

  .hero[data-layout="right"] {
    flex-direction: row-reverse;
  }

  .hero[data-layout="vertical"] {
    flex-direction: column;
    width: 100%;
  }

  .hero[data-vertical-align="top"] {
    height: fit-content;
    margin-bottom: auto;
    flex: unset;
  }

  .hero[data-vertical-align="center"] {
    height: fit-content;
    margin: auto 0;
    flex: unset;
  }

  .hero[data-vertical-align="bottom"] {
    margin-top: auto;
  }

  .image-container {
    min-height: 0;
    height: 100%;
    max-height: fit-content;
    display: flex;
    align-items: inherit;
  }

  .hero[data-layout="vertical"] .image-container {
    flex: 1;
    width: 100%;
    align-items: center;
    max-height: unset;
  }

  .hero[data-layout="vertical"] .image-container[data-layout="left"] {
    flex-direction: row;
  }

  .hero[data-layout="vertical"] .image-container[data-layout="center"] {
    justify-content: center;
  }

  .hero[data-layout="vertical"] .image-container[data-layout="right"] {
    flex-direction: row-reverse;
  }

  .hero[data-vertical-align="top"] .image-container {
    align-items: start;
  }

  .hero[data-vertical-align="center"] .image-container {
    align-items: center;
  }

  .hero[data-vertical-align="bottom"] .image-container {
    flex: unset;
    align-self: end;
  }

  .image {
    height: 100%;
    max-height: calc(
      var(--row-height) * var(--max-image-size) + var(--row-gap) *
        (var(--max-image-size) - 1) - var(--card-padding) * 2
    );
  }

  .image img {
    width: 100%;
    height: 100%;
    border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
  }

  .media-info-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .hero[data-layout="vertical"] .media-info-container {
    flex: unset;
    flex-grow: 0.1;
    width: 100%;
    min-height: max-content;
  }

  .hero[data-vertical-align="top"] .media-info-container {
    align-items: start;
    margin-bottom: auto;
  }

  .hero[data-vertical-align="center"] .media-info-container {
    align-items: center;
    margin: auto 0;
  }

  .hero[data-vertical-align="bottom"] .media-info-container {
    align-items: end;
    margin-top: auto;
  }

  .media-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    min-height: 52px;
  }

  .hero[data-layout="vertical"] .media-info {
    min-height: 0;
  }

  .media-info[data-horizontal-align="left"] {
    text-align: left;
  }

  .media-info[data-horizontal-align="center"] {
    align-items: center;
  }

  .media-info[data-horizontal-align="right"] {
    text-align: right;
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

  hui-card-features {
    pointer-events: all;
  }

  .visually-hidden {
    display: none;
  }
`;
