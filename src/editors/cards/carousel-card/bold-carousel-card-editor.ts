import { html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { SortableListItem } from "../../../components/bc-sortable-list";
import { t } from "../../../localization/i18n";
import { mdiCardText, mdiPlus } from "@mdi/js";
import { LovelaceCardConfig } from "../../../types/ha/lovelace";
import {
  isEmpty,
  isUndefined,
  move,
  patchElement,
  splice,
} from "../../../lib/helpers";
import {
  enrichCarouselCardConfig,
  stripCarouselCardConfig,
} from "../../../cards/carousel-card/helpers";
import { BoldCarouselCardEditorBase } from "./base";
import { getResult } from "../../../lib/result";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldCarouselCardEditorBase<CarouselCardConfig> {
  protected get _struct() {
    return carouselCardConfigStruct;
  }

  public setConfig(config: CarouselCardConfig): void {
    // ensure all editors are loaded, if a new one was loaded, reload the error to validate
    Promise.all(
      config.cards.map((entry) => this.loadCard(entry.card.type)),
    ).then((results) => {
      results.map(getResult).some((didChange) => {
        if (didChange) {
          this.forceReloadEditor()
            .ifError(() =>
              this.errorToast("Failed to refresh editor, validation may fail"),
            )
            .logError();
        }
      });
    });

    // validate all cards
    config.cards.forEach((entry) => {
      const cardConfig = enrichCarouselCardConfig({
        config,
        entry,
      });
      this.validateCardConfig(cardConfig).throwIfError(
        (error) => `Invalid card config: ${error.message}`,
      );
    });

    super.setConfig(config);

    if (isEmpty(config.cards)) {
      this.openPickCard();
    }
  }

  protected openPickCard() {
    this.openSubEditor({
      title: t("editor.card.carousel.label.add_card"),
      showBack: !isEmpty(this._config?.cards),
      render: () => html`
        <bc-card-picker
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .filter=${(card: LovelaceCardConfig) => {
            return (
              card.type !== BoldCardType.CAROUSEL &&
              card.type !== BoldCardType.ENTITY_CAROUSEL
            );
          }}
          @config-changed=${this._handleCardPicked}
        ></bc-card-picker>
      `,
    });
  }

  protected openEditCard(index: number) {
    if (isUndefined(this._config?.cards)) {
      throw new Error("No cards defined");
    }

    return this.openSubEditor({
      title: this.getCardTypeName(this._config?.cards[index]?.card.type),
      render: () => {
        const card = enrichCarouselCardConfig({
          config: this._config!,
          entry: this._config!.cards[index],
        });

        return html`
          <hui-card-element-editor
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            .value=${card}
            @config-changed=${(
              ev: CustomEvent<{ config: LovelaceCardConfig }>,
            ) => {
              ev.stopPropagation();
              this._updateCardConfig(index, ev.detail.config);
            }}
            @GUImode-changed=${(ev: CustomEvent) => {
              ev.stopPropagation();
            }}
          ></hui-card-element-editor>
        `;
      },
    });
  }

  protected render() {
    return this.renderWith(() => {
      if (!this.hass || !this._config) {
        return nothing;
      }

      const items = this._config.cards.map(
        (entry, index): SortableListItem => ({
          label: this.getCardConfigHumanReadableName(
            entry.card as LovelaceCardConfig,
          ).join(" • "),
          key: Object.entries(entry.card).flat().join(),
          onEdit: () => this.openEditCard(index),
          onRemove: () => this._removeCard(index),
          onDuplicate: () => this._duplicateCard(index),
        }),
      );

      return html`
        ${this.renderCarouselLayoutSection()}
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
                  this.openPickCard();
                }}
              >
                <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
              </ha-button>
            </bc-sortable-list>
          </div>
        </ha-expansion-panel>
      `;
    });
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

    await this.loadCard(card.type);

    this.patchConfig({
      cards: [...oldCards, { card }],
    });

    this.closeSubEditor();
  }

  private _handleCardMoved(
    ev: CustomEvent<{ newIndex: number; oldIndex: number }>,
  ) {
    ev.stopPropagation();

    this.patchConfig({
      cards: move(this._config?.cards, ev.detail.oldIndex, ev.detail.newIndex),
    });
  }

  private _duplicateCard(index: number) {
    const oldCards = this._config?.cards;
    const newCardEntry = this._config?.cards[index];
    if (isUndefined(oldCards) || isUndefined(newCardEntry)) {
      return;
    }

    this.patchConfig({
      cards: [...oldCards, newCardEntry],
    });
  }

  private _removeCard(index: number) {
    this.patchConfig({
      cards: splice(this._config?.cards, index),
    });
  }

  private _updateCardConfig(index: number, newConfig: LovelaceCardConfig) {
    const card = stripCarouselCardConfig(newConfig);
    this.patchConfig({
      cards: patchElement(this._config?.cards, index, { card }),
    });
  }
}
