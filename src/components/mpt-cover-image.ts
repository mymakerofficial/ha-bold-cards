import { customElement, property } from "lit/decorators";
import { css, html, LitElement } from "lit";

@customElement("mpt-cover-image")
export class CoverImage extends LitElement {
  @property({ attribute: false })
  public imageUrl?: string;

  protected render() {
    return html`<div class="container">
      <img alt="" src=${this.imageUrl} />
    </div>`;
  }

  static styles = css`
    .container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      height: 64px;
      overflow: hidden;
      border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `;
}
