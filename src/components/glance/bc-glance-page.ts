import { customElement, property, state } from "lit/decorators";
import { BoldHassElement } from "../hass-element";
import {
  GlanceItemConfig,
  GlanceItemType,
  GlancePageConfig,
  GlancePageType,
} from "../../lib/at-a-glance/types";
import { css, html, nothing } from "lit";
import {
  TemplatedConfigListRenderer,
  TemplatedConfigRenderer,
} from "../../lib/templates/templated-config-renderer";
import { PropertyValues } from "@lit/reactive-element";
import { repeat } from "lit-html/directives/repeat";

@customElement("bc-glance-page")
export class BcGlancePage extends BoldHassElement {
  @property({ attribute: false }) public config?: GlancePageConfig;

  @state() protected _page: GlancePageConfig | undefined;

  private pageRenderer?: TemplatedConfigRenderer<GlancePageConfig>;
  private itemsRenderer?: TemplatedConfigListRenderer<GlanceItemConfig>;

  public connectedCallback() {
    super.connectedCallback();

    if (!this.config) {
      return;
    }

    this.pageRenderer = this.getGlancePageRenderer(this.config?.type);

    this.pageRenderer.subscribe((page) => {
      if (!page) {
        this._page = undefined;
        return;
      }
      this._page = { ...page, items: this._page?.items };
    });

    this.itemsRenderer = this.getGlanceItemsRenderer(true);

    this.itemsRenderer.subscribe((list) => {
      if (!this._page) {
        return;
      }
      this._page.items = list.filter((it) => {
        if (it.type !== GlanceItemType.CUSTOM) {
          return true;
        }
        return it.visibility ?? true;
      });
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.pageRenderer?.destroy();
    this.itemsRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("config") && this.pageRenderer && this.itemsRenderer) {
      this._page = this.config;
      this.pageRenderer.setValue(this.config);
      this.itemsRenderer.setList(this.config?.items);
    }
  }

  render() {
    if (!this._page) {
      return nothing;
    }

    if (this._page.type === GlancePageType.CUSTOM) {
      return html`
        <h1 class="label">${this._page.title}</h1>
        <div class="items">
          ${repeat(
            this._page.items ?? [],
            (item) => html`
              <bc-glance-page-item
                .hass=${this.hass}
                .config=${item}
              ></bc-glance-page-item>
            `,
          )}
        </div>
      `;
    }

    if (this._page.type === GlancePageType.DATE_TIME) {
      return html`
        <h1 class="label">TODO</h1>
        <div class="items">
          ${repeat(
            this._page.items ?? [],
            (item) => html`
              <bc-glance-page-item .item=${item}></bc-glance-page-item>
            `,
          )}
        </div>
      `;
    }

    return nothing;
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
        font-size: 1.5rem;
        font-weight: 400;
        margin: 0;
      }

      .items {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
    `;
  }
}
