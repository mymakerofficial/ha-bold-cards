import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { SortableListItem } from "../../../components/bc-sortable-list";
import { t } from "../../../localization/i18n";
import { mdiCardText, mdiPlus } from "@mdi/js";
import { LovelaceCardConfig } from "../../../types/ha/lovelace";
import { isUndefined, move, patchElement, splice } from "../../../lib/helpers";
import {
  enrichCarouselCardConfig,
  stripCarouselCardConfig,
} from "../../../cards/carousel-card/helpers";
import { BoldCarouselCardEditorBase } from "./base";
import { resolveResult } from "../../../lib/result";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldCarouselCardEditorBase<CarouselCardConfig> {
  @state() private _isPicking = false;
  @state() private _editIndex = -1;

  protected get _struct() {
    return carouselCardConfigStruct;
  }

  public setConfig(config: CarouselCardConfig): void {
    // ensure all editors are loaded, if a new one was loaded, reload the error to validate
    Promise.all(
      config.cards.map((entry) => this._loadCardEditor(entry.card.type)),
    ).then((results) => {
      results.some((didChange) => {
        if (didChange) {
          this._reload();
        }
      });
    });

    // validate all cards
    config.cards.forEach((entry) => {
      const cardConfig = enrichCarouselCardConfig({
        config,
        entry,
      });
      const res = this._validateCardConfig(cardConfig);
      resolveResult(res, (message) => `Invalid card config: ${message}`);
    });

    super.setConfig(config);
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    if (this._isLoadingCardEditor) {
      return html`
        <bc-spinner
          .label=${t("editor.card.carousel.helper_text.loading_editor")}
        ></bc-spinner>
      `;
    }

    if (this._isPicking || this._config.cards.length === 0) {
      return this._renderSubEditor({
        title: t("editor.card.carousel.label.add_card"),
        onBack: () => (this._isPicking = false),
        showHeader: this._config.cards.length > 0,
        content: html`
          <bc-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            .filter=${(card: LovelaceCardConfig) => {
              return (
                card.type !== BoldCardType.CAROUSEL &&
                card.type !== BoldCardType.ENTITY_CAROUSEL
              );
            }}
            @config-changed=${(ev) => {
              this._isPicking = false;
              return this._handleCardPicked(ev);
            }}
          ></bc-card-picker>
        `,
      });
    }

    if (this._editIndex > -1) {
      const card = enrichCarouselCardConfig({
        config: this._config,
        entry: this._config.cards[this._editIndex],
      });

      return this._renderSubEditor({
        onBack: () => (this._editIndex = -1),
        title: this.getCardTypeName(card.type),
        content: html`
          <hui-card-element-editor
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            .value=${card}
            @config-changed=${(
              ev: CustomEvent<{ config: LovelaceCardConfig }>,
            ) => {
              ev.stopPropagation();
              this._updateCardConfig(this._editIndex, ev.detail.config);
            }}
            @GUImode-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
            }}
          ></hui-card-element-editor>
        `,
      });
    }

    const items = this._config.cards.map(
      (entry, index): SortableListItem => ({
        label: this.getCardConfigHumanReadableName(
          entry.card as LovelaceCardConfig,
        ).join(" • "),
        key: Object.entries(entry.card).flat().join(),
        onEdit: () => (this._editIndex = index),
        onRemove: () => this._removeCard(index),
        onDuplicate: () => this._duplicateCard(index),
      }),
    );

    return html`
      ${this._renderCarouselLayoutSection()}
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

  private async _handleCardPicked(
    ev: CustomEvent<{ config?: LovelaceCardConfig }>,
  ) {
    ev.stopPropagation();

    const oldCards = this._config?.cards;
    const newCardConfig = ev.detail.config;
    if (isUndefined(oldCards) || isUndefined(newCardConfig)) {
      return;
    }

    const card = stripCarouselCardConfig(newCardConfig);

    await this._loadCardEditor(card.type);

    this._patchConfig({
      cards: [...oldCards, { card }],
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

  private _duplicateCard(index: number) {
    const oldCards = this._config?.cards;
    const newCardEntry = this._config?.cards[index];
    if (isUndefined(oldCards) || isUndefined(newCardEntry)) {
      return;
    }

    this._patchConfig({
      cards: [...oldCards, newCardEntry],
    });
  }

  private _removeCard(index: number) {
    this._patchConfig({
      cards: splice(this._config?.cards, index),
    });
  }

  private _updateCardConfig(index: number, newConfig: LovelaceCardConfig) {
    const card = stripCarouselCardConfig(newConfig);
    this._patchConfig({
      cards: patchElement(this._config?.cards, index, { card }),
    });
  }
}
