import { BoldHassElement } from "../hass-element";
import { customElement, property, state } from "lit/decorators";
import { css, html, nothing } from "lit";
import { GlanceItemConfig, GlanceItemType } from "../../lib/at-a-glance/types";
import { mdiCircle } from "@mdi/js";
import { TemplatedConfigRenderer } from "../../lib/templates/templated-config-renderer";
import { PropertyValues } from "@lit/reactive-element";

@customElement("bc-glance-page-item")
export class BcGlancePageItem extends BoldHassElement {
  @property({ attribute: false }) public config?: GlanceItemConfig;

  @state() protected _item: GlanceItemConfig | undefined;

  private itemRenderer?: TemplatedConfigRenderer<GlanceItemConfig>;

  public connectedCallback() {
    super.connectedCallback();

    if (!this.config) {
      return;
    }

    this.itemRenderer = this.getGlanceItemRenderer(this.config?.type);

    this.itemRenderer.subscribe((item) => {
      this._item = item;
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.itemRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("config") && this.itemRenderer) {
      this.itemRenderer.setValue(this.config);
    }
  }

  render() {
    const item = this._item;

    if (!item) {
      return nothing;
    }

    if (item.type === GlanceItemType.CUSTOM) {
      return html`
        ${item.icon
          ? html` <div class="icon">
              <bc-icon icon=${item.icon}></bc-icon>
            </div>`
          : html` <ha-svg-icon
              class="spacer-dot"
              .path=${mdiCircle}
            ></ha-svg-icon>`}
        <span>${item.content}</span>
      `;
    }

    if (item.type === GlanceItemType.WEATHER) {
      return html`
        ${item.icon
          ? html` <div class="icon">
              <bc-icon icon=${item.icon}></bc-icon>
            </div>`
          : html` <ha-svg-icon
              class="spacer-dot"
              .path=${mdiCircle}
            ></ha-svg-icon>`}
        <span>${item.content}</span>
      `;
    }

    return nothing;
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

      span {
        font-size: 1rem;
      }
    `;
  }
}
