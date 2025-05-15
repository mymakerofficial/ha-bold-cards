import { BoldHassElement } from "../../hass-element";
import { property, state } from "lit/decorators";
import { css, html, nothing } from "lit";
import { GlanceItemConfig } from "../../../lib/at-a-glance/types";
import { ConfigRenderer } from "../../../lib/templates/templated-config-renderer";
import { PropertyValues } from "@lit/reactive-element";
import { Maybe } from "../../../lib/types";
import { mdiCircle } from "@mdi/js";

export abstract class BcGlanceItemBase<
  TConfig extends GlanceItemConfig,
  TItem = TConfig,
> extends BoldHassElement {
  @property({ attribute: false }) public config?: GlanceItemConfig;

  @state() protected _item: Maybe<TItem>;

  protected _itemRenderer?: ConfigRenderer<TConfig>;

  protected abstract getItem(config: Maybe<GlanceItemConfig>): Maybe<TItem>;

  public connectedCallback() {
    super.connectedCallback();

    this._itemRenderer =
      this.getGlanceItemRenderer() as ConfigRenderer<TConfig>;

    this._itemRenderer.subscribe((config) => {
      this._item = this.getItem(config as GlanceItemConfig);
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._itemRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("config") && this._itemRenderer) {
      this._item = this.getItem(this.config as GlanceItemConfig);
      this._itemRenderer.setValue(this.config as TConfig);
    }
  }

  protected _baseTemplate({
    content,
    contentIsPending,
    icon,
    iconIsPending,
  }: {
    content?: string;
    contentIsPending?: boolean;
    icon?: string;
    iconIsPending?: boolean;
  }) {
    return html`
      ${icon && !iconIsPending
        ? html`<div class="icon">
            <bc-icon icon=${icon}></bc-icon>
          </div>`
        : html`<ha-svg-icon
            class="spacer-dot"
            .path=${mdiCircle}
          ></ha-svg-icon>`}
      <span class="content"
        >${contentIsPending
          ? html`<span class="skeleton"></span>`
          : nothing}${content}</span
      >
    `;
  }

  static get styles() {
    return css`
      :host {
        height: 24px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .icon {
        width: 24px;
        height: 24px;
      }

      .icon > * {
        width: 24px;
        height: 24px;
        --mdc-icon-size: 24px;
      }

      .spacer-dot {
        width: 4px;
        height: 4px;
        color: var(--secondary-text-color);
        opacity: 0.9;
      }

      .content {
        position: relative;
        font-size: 1rem;
        height: 24px;
        line-height: 24px;
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
