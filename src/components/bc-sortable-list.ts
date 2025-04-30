import { customElement, property } from "lit/decorators";
import { css, html, nothing } from "lit";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPencil } from "@mdi/js";
import { t } from "../localization/i18n";
import { editorBaseStyles } from "../editors/styles";
import { isDefined } from "../lib/helpers";
import { BoldElement } from "./bold-element";

export interface SortableListItem {
  label: string;
  key: string;
  onEdit?: () => void;
  onRemove?: () => void;
}

@customElement("bc-sortable-list")
export class BcSortableList extends BoldElement {
  @property({ attribute: false }) public items: SortableListItem[] = [];

  protected _renderItem(item: SortableListItem) {
    return html`
      <div class="item">
        <div class="handle">
          <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
        </div>
        <div class="content">
          <label>${item.label}</label>
        </div>
        <div class="actions">
          ${isDefined(item.onEdit)
            ? html`
                <ha-icon-button
                  .label=${t("editor.common.label.edit")}
                  .path=${mdiPencil}
                  class="edit-icon"
                  @click=${item.onEdit}
                ></ha-icon-button>
              `
            : nothing}
          ${isDefined(item.onRemove)
            ? html`
                <ha-icon-button
                  .label=${t("editor.common.label.remove")}
                  .path=${mdiDelete}
                  class="remove-icon"
                  @click=${item.onRemove}
                ></ha-icon-button>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  protected render() {
    return html`
      <ha-sortable handle-selector=".handle">
        <div class="items">
          ${repeat(
            this.items ?? [],
            (item) => item,
            (item) => this._renderItem(item),
          )}
        </div>
      </ha-sortable>
      <div>
        <slot></slot>
      </div>
    `;
  }

  static styles = [
    editorBaseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: none;
        border-width: 1px;
        border-style: solid;
        border-color: var(--outline-color);
        border-radius: 6px;
      }

      .item .handle {
        cursor: move; /* fallback if grab cursor is unsupported */
        cursor: grab;
        padding: 12px;
        direction: var(--direction);
      }

      .item .handle > * {
        pointer-events: none;
      }

      .content {
        flex: 1;
      }

      .content label {
        font-weight: 500;
      }

      .actions {
        display: flex;
      }
    `,
  ];
}
