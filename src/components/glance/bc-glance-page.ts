import { customElement, property, state } from "lit/decorators";
import { BoldHassElement } from "../hass-element";
import {
  ConcreteCustomGlanceItem,
  ConcreteGlancePage,
  CustomGlanceItemConfig,
  GlancePageType,
} from "../../lib/at-a-glance/types";
import { css, html, nothing } from "lit";
import { TemplatedConfigListRenderer } from "../../lib/templates/templated-config-renderer";
import { PropertyValues } from "@lit/reactive-element";
import { repeat } from "lit-html/directives/repeat";

@customElement("bc-glance-page")
export class BcGlancePage extends BoldHassElement {
  @property({ attribute: false }) public page?: ConcreteGlancePage;

  @state() private _items: ConcreteCustomGlanceItem[] = [];

  private itemsRenderer?: TemplatedConfigListRenderer<
    CustomGlanceItemConfig,
    ConcreteCustomGlanceItem
  >;

  public connectedCallback() {
    super.connectedCallback();

    this.itemsRenderer = this.getCustomGlanceItemsRenderer();

    this.itemsRenderer.subscribe((list) => {
      console.log(list);
      this._items = list ?? [];
    });
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (
      changedProps.has("page") &&
      this.itemsRenderer &&
      this.page &&
      this.page.type === GlancePageType.CUSTOM
    ) {
      this.itemsRenderer.setList(this.page.items);
    }
  }

  render() {
    if (!this.page) {
      return nothing;
    }

    // TODO support other types
    if (this.page.type !== GlancePageType.CUSTOM) {
      return nothing;
    }

    return html`
      <h1 class="label">${this.page.title}</h1>
      <div class="items">
        ${repeat(
          this._items,
          (item) => html`
            <bc-glance-page-item
              .icon=${html`<ha-icon icon=${item.icon}></ha-icon>`}
              .label=${item.content}
            ></bc-glance-page-item>
          `,
        )}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .label {
        font-size: 1.5rem;
        font-weight: 400;
      }

      .items {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
    `;
  }
}
