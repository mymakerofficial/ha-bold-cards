import { BoldLovelaceCardEditor } from "../base";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { editorBaseStyles } from "../../styles";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import {
  carouselCardAllowedStepperPositions,
  carouselCardConfigStruct,
} from "../../../cards/carousel-card/struct";
import { SortableListItem } from "../../../components/bc-sortable-list";
import { t } from "../../../localization/i18n";
import { mdiCardText, mdiCursorMove, mdiPlus } from "@mdi/js";
import { LovelaceCardConfig } from "../../../types/ha/lovelace";
import { isUndefined, move, patchElement, splice } from "../../../lib/helpers";
import {
  enrichCarouselCardConfig,
  stripCarouselCardConfig,
} from "../../../cards/carousel-card/helpers";
import { Position } from "../../../lib/layout/position";

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
      <ha-expansion-panel outlined expanded>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCursorMove}></ha-svg-icon>
          ${t("editor.card.carousel.label.layout")}
        </h3>
        <div class="content">
          <bc-form-element
            .label=${t("editor.card.carousel.label.stepper_position")}
          >
            <bc-layout-select
              .label=${t("editor.card.carousel.label.stepper_position")}
              .hideLabel=${true}
              .value=${this._config.stepper_position ?? Position.BOTTOM_CENTER}
              .positions=${carouselCardAllowedStepperPositions}
              @value-changed=${(ev) =>
                this._handleValueChanged("stepper_position", ev)}
              .hass=${this.hass}
            ></bc-layout-select>
          </bc-form-element>
        </div>
      </ha-expansion-panel>
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

    const card = stripCarouselCardConfig(newCardConfig);
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

  static styles: CSSResultGroup = [
    editorBaseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ];
}
