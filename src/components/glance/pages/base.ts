import { BoldHassElement } from "../../hass-element";
import { property, state } from "lit/decorators.js";
import { css, html, nothing } from "lit";
import {
  GlanceItemConfig,
  GlancePageConfig,
} from "../../../lib/at-a-glance/types";
import { ConfigRenderer } from "../../../lib/templates/templated-config-renderer";
import { PropertyValues } from "@lit/reactive-element";
import { Maybe } from "../../../lib/types";

export abstract class BcGlancePageBase<
  TConfig extends GlancePageConfig,
  TPage = TConfig,
> extends BoldHassElement {
  @property({ attribute: false }) public config?: GlancePageConfig;

  @state() protected _page: Maybe<TPage>;

  protected _pageRenderer?: ConfigRenderer<TConfig>;

  protected abstract getPage(config: Maybe<GlancePageConfig>): Maybe<TPage>;

  public connectedCallback() {
    super.connectedCallback();

    this._pageRenderer =
      this.getGlancePageRenderer() as ConfigRenderer<TConfig>;

    this._pageRenderer.subscribe((config) => {
      this._page = this.getPage(config as GlancePageConfig);
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._pageRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("config") && this._pageRenderer) {
      this._page = this.getPage(this.config as GlancePageConfig);
      this._pageRenderer.setValue(this.config as TConfig);
    }
  }

  protected _baseTemplate({
    label,
    labelIsPending,
    items,
  }: {
    label?: string;
    labelIsPending?: boolean;
    items?: GlanceItemConfig[];
  }) {
    return html`
      <h1 class="label">
        ${labelIsPending
          ? html`<span class="skeleton"></span>`
          : nothing}${label}
      </h1>
      <bc-glance-item-list
        .hass=${this.hass}
        .items=${items}
      ></bc-glance-item-list>
    `;
  }

  static get styles() {
    return css`
      :host {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .label {
        height: 20px;
        position: relative;
        font-size: 1.5rem;
        font-weight: 400;
        margin: 0;
      }

      .skeleton {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 120px;
        max-width: 100%;
        height: 100%;
        border-radius: 4px;
        background-image: linear-gradient(
          to right,
          rgb(from var(--primary-text-color) r g b / 50%) 0%,
          rgb(from var(--primary-text-color) r g b / 20%) 50%,
          rgb(from var(--primary-text-color) r g b / 50%) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite linear;
      }

      @keyframes shimmer {
        to {
          background-position: -200% 0;
        }
      }
    `;
  }
}
