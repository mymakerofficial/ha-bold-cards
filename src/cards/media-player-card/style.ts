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
      var(--row-height) * 2 + var(--row-gap) - var(--card-padding) * 2
    );
  }

  .content[data-layout="vertical"] {
    min-height: calc(
      var(--row-height) * 5 + var(--row-gap) * 4 - var(--card-padding) * 2
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

  .header {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: end;
    gap: var(--card-padding);
    min-height: 0;
    min-width: 0;
    box-sizing: border-box;
    pointer-events: none;
  }

  .header[data-align="center"] {
    justify-content: center;
  }

  .header[data-align="right"] {
    flex-direction: row-reverse;
  }

  .content[data-layout="vertical"] .header {
    padding-top: var(--card-padding);
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 24px;
  }

  .image {
    height: 100%;
    max-height: calc(
      var(--row-height) * 3 + var(--row-gap) * 2 - var(--card-padding) * 2
    );
  }

  .image img {
    width: 100%;
    height: 100%;
    border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
  }

  .media-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    margin-top: auto;
    min-height: 52px;
  }

  .content[data-layout="vertical"] .media-info {
    flex: 0;
    width: 100%;
    gap: 8px;
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

  .header[data-align="center"] .media-info {
    align-items: center;
  }

  .header[data-align="right"] .media-info {
    text-align: right;
  }

  .content[data-layout="vertical"] .media-info .primary {
    font-size: 1.4rem;
    font-weight: 400;
  }

  .content[data-layout="vertical"] .media-info .secondary {
    font-size: 0.9rem;
    font-weight: 400;
  }

  hui-card-features {
    pointer-events: all;
  }
`;
