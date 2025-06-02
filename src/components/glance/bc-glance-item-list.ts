import { BoldHassElement } from "../hass-element";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { GlanceItemConfig } from "../../lib/at-a-glance/types";
import { customElement, property, state } from "lit/decorators";
import { isEmpty, isUndefined } from "../../lib/helpers";
import { TemplatedConfigListRenderer } from "../../lib/templates/templated-config-renderer";
import { PropertyValues } from "lit-element";

@customElement("bc-glance-item-list")
export class BcGlanceItemList extends BoldHassElement {
  @property({ attribute: false }) public items?: GlanceItemConfig[];

  @state() private _visibleItems?: GlanceItemConfig[];

  private _itemsRenderer?: TemplatedConfigListRenderer<GlanceItemConfig>;

  public connectedCallback() {
    super.connectedCallback();

    this._itemsRenderer = this.getGlanceItemsRenderer(true);

    this._itemsRenderer.subscribe((items) => {
      this._visibleItems = items;
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this._itemsRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("items") && this._itemsRenderer) {
      this._visibleItems = this.items;
      this._itemsRenderer.setList(this.items);
    }
  }

  render() {
    const items = this._visibleItems;

    if (isUndefined(items) || isEmpty(items)) {
      return nothing;
    }

    return repeat(
      items,
      (item) => html`
        <bc-glance-item .hass=${this.hass} .config=${item}></bc-glance-item>
      `,
    );
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      gap: 8px;
    }
  `;
}
