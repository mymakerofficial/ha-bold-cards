import { BoldLovelaceCardEditor } from "../base";
import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, query, state } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { editorBaseStyles } from "../../styles";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { SortableListItem } from "../../../components/bc-sortable-list";
import { t } from "../../../localization/i18n";
import { mdiCardText, mdiChevronLeft, mdiPlus } from "@mdi/js";
import { LovelaceCardConfig } from "../../../types/ha/lovelace";
import { isUndefined, move, splice } from "../../../lib/helpers";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  @state() private _isPicking = false;
  @state() private _editIndex = -1;

  protected get _struct() {
    return carouselCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    if (this._isPicking || this._config.cards.length === 0) {
      return html`
        ${this._config.cards.length > 0
          ? html`
              <div>
                <ha-button
                  .label=${t("editor.common.label.back")}
                  @click=${(ev) => {
                    ev.stopPropagation();
                    this._isPicking = false;
                  }}
                >
                  <ha-svg-icon
                    .path=${mdiChevronLeft}
                    slot="icon"
                  ></ha-svg-icon>
                </ha-button>
              </div>
            `
          : nothing}
        <bc-card-picker
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          @config-changed=${(ev) => {
            this._isPicking = false;
            return this._handleCardPicked(ev);
          }}
        ></bc-card-picker>
      `;
    }

    if (this._editIndex > -1) {
      const card = this._config.cards[this._editIndex];
      return html`
        <div>
          <ha-button
            .label=${t("editor.common.label.back")}
            @click=${(ev) => {
              ev.stopPropagation();
              this._editIndex = -1;
            }}
          >
            <ha-svg-icon .path=${mdiChevronLeft} slot="icon"></ha-svg-icon>
          </ha-button>
        </div>
        <hui-card-element-editor
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .value=${card}
          @config-changed=${(
            ev: CustomEvent<{ config: LovelaceCardConfig }>,
          ) => {
            ev.stopPropagation();
            this._updateCard(this._editIndex, ev.detail.config);
          }}
          @GUImode-changed=${(ev: CustomEvent) => {
            ev.stopPropagation();
          }}
        ></hui-card-element-editor>
      `;
    }

    const items = this._config.cards.map(
      (card, index): SortableListItem => ({
        label: this.getCardConfigHumanReadableName(
          card as LovelaceCardConfig,
        ).join(" • "),
        key: Object.entries(card).flat().join(),
        onEdit: () => (this._editIndex = index),
        onRemove: () => this._removeCard(index),
      }),
    );

    return html`
      <ha-expansion-panel outlined expanded>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCardText}></ha-svg-icon>
          ${t("editor.card.carousel.label.cards")}
        </h3>
        <div class="content">
          <bc-sortable-list
            .items=${items}
            @item-moved=${this._handleCardMoved}
          >
            <ha-button
              outlined
              .label=${t("editor.card.carousel.label.add_card")}
              @click=${(ev) => {
                ev.stopPropagation();
                this._isPicking = true;
              }}
            >
              <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
            </ha-button>
          </bc-sortable-list>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _handleCardPicked(ev: CustomEvent<{ config?: LovelaceCardConfig }>) {
    ev.stopPropagation();

    const oldCards = this._config?.cards;
    const newCardConfig = ev.detail.config;
    if (isUndefined(oldCards) || isUndefined(newCardConfig)) {
      return;
    }

    this._patchConfig({
      cards: [...oldCards, newCardConfig],
    });

    this._editIndex = oldCards.length;
  }

  private _handleCardMoved(
    ev: CustomEvent<{ newIndex: number; oldIndex: number }>,
  ) {
    ev.stopPropagation();

    this._patchConfig({
      cards: move(this._config?.cards, ev.detail.oldIndex, ev.detail.newIndex),
    });
  }

  private _removeCard(index: number) {
    this._patchConfig({
      cards: splice(this._config?.cards, index),
    });
  }

  private _updateCard(index: number, newConfig: LovelaceCardConfig) {
    this._patchConfig({
      cards: splice(this._config?.cards, index, 1, newConfig),
    });
  }

  static styles: CSSResultGroup = [editorBaseStyles];
}
