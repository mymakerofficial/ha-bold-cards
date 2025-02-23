import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";

@customElement("mpt-cover-image")
export class CoverImage extends LitElement {
  @property({ attribute: false })
  public imageUrl?: string;

  protected render() {
    if (this.imageUrl) {
      return html`
        <div class="container">
          <img alt="" src=${this.imageUrl} />
        </div>
        <slot></slot>
      `;
    }

    return html`
      <div class="container background">
        <slot name="icon"></slot>
      </div>
      <slot></slot>
    `;
  }

  static styles = css`
    :host {
      --image-size: 64px;
    }

    .container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: var(--image-size);
      height: var(--image-size);
      overflow: hidden;
      border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
    }

    .container.background::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background-color: var(--tile-icon-color);
      transition:
        background-color 180ms ease-in-out,
        opacity 180ms ease-in-out;
      opacity: 0.2;
    }

    .container ::slotted([slot="icon"]) {
      display: flex;
      color: var(--tile-icon-color);
      transition: color 180ms ease-in-out;
      pointer-events: none;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
}
