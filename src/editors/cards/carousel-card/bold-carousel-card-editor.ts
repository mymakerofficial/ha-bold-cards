import { BoldLovelaceCardEditor } from "../base";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { editorBaseStyles } from "../../styles";
import { LovelaceCardConfigWithEntity } from "../../../types/card";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { SortableListItem } from "../../../components/bc-sortable-list";
import { t } from "../../../localization/i18n";
import { mdiPlus } from "@mdi/js";
import { mdiCardMultipleOutline } from "@mdi/js/commonjs/mdi";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  protected get _struct() {
    return carouselCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCardMultipleOutline}></ha-svg-icon>
          ${t("editor.card.carousel.label.cards")}
        </h3>
        <div class="content">
          <bc-sortable-list
            .items=${this._config.cards.map(
              (card, index): SortableListItem => ({
                label: this.getCardTypeName(card.type),
                key: card.type + index,
                onEdit: () => {},
                onRemove: () => {},
              }),
            )}
            @item-moved=${console.log}
          >
            <ha-button
              outlined
              .label=${t("editor.card.carousel.label.add_card")}
            >
              <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
            </ha-button>
          </bc-sortable-list>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _stripCardConfig(config: LovelaceCardConfigWithEntity) {
    const {
      view_layout: _view_layout,
      layout_options: _layout_options,
      grid_options: _grid_options,
      visibility: _visibility,
      ...card
    } = config;
    return card;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this.fireEvent("config-changed", { config: ev.detail.value });
  }

  static styles: CSSResultGroup = [
    editorBaseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .description {
        color: var(--secondary-text-color);
        padding: 8px;
      }

      hr {
        border: none;
        border-top: 1px solid var(--divider-color);
      }
    `,
  ];
}
