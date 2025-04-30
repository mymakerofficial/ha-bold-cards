import { customElement, property, query, state } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import {
  LovelaceCardConfig,
  LovelaceCardConstructor,
  LovelaceCardEditor,
} from "../types/ha/lovelace";
import { BoldHassElement } from "./hass-element";
import { LovelaceConfig } from "custom-card-helpers";
import { PropertyValues, TemplateResult } from "lit-element";
import { isDefined, isUndefined, toPromise } from "../lib/helpers";
import { optionallyPrefixCustomType } from "../lib/cards/helpers";
import { Optional } from "../lib/types";
import { classMap } from "lit-html/directives/class-map";
import { t } from "../localization/i18n";
import { BoldCardType } from "../lib/cards/types";

export interface Card {
  type: string;
  name?: string;
  description?: string;
  showElement?: boolean;
  isCustom?: boolean;
  isSuggested?: boolean;
}

interface CardElement {
  card: Card;
  element: TemplateResult;
}

interface CardElementWithStub extends CardElement {
  stub: LovelaceCardConfig;
}

const SUGGESTED_CARDS: string[] = ["tile", BoldCardType.MEDIA_PLAYER];

// loads the hui-card-picker element
async function loadCardPicker() {
  if (isDefined(customElements.get("hui-card-picker"))) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const card = document.createElement("hui-card") as LitElement & {
      _loadElement: (config: LovelaceCardConfig) => void;
    };

    card.addEventListener("card-updated", () => {
      const conditionalCard = customElements.get(
        "hui-conditional-card",
      ) as Optional<LovelaceCardConstructor>;

      if (isUndefined(conditionalCard)) {
        reject(new Error("hui-conditional-card not found"));
        return;
      }

      if (isUndefined(conditionalCard.getConfigElement)) {
        reject(new Error("getConfigElement not found"));
        return;
      }

      toPromise(conditionalCard.getConfigElement()).then(() => {
        resolve();
      });
    });

    card._loadElement({
      type: "conditional",
      conditions: [],
      card: { type: "heading" },
    });
  });
}

@customElement("bc-card-picker")
class BcCardPicker extends BoldHassElement {
  public lovelace?: LovelaceConfig;

  @property({ attribute: false }) public filter?: (
    config: LovelaceCardConfig,
  ) => boolean;

  @state() private _loading = true;
  @state() private _done = false;

  @query("hui-card-picker")
  private _cardPickerEl?: LovelaceCardEditor &
    LitElement & {
      _cards: CardElement[];
    };

  private async _load() {
    if (!this.hass || !this.lovelace) {
      throw new Error("Hass or Lovelace not defined");
    }

    await loadCardPicker();
    this._loading = false;
  }

  private async _transformCards(cards: CardElement[]) {
    const entityIds = this.getAllEntityIds();

    const promises = cards.map(async (card): Promise<CardElementWithStub> => {
      const type = optionallyPrefixCustomType(
        card.card.type,
        card.card.isCustom,
      );
      const stubConfig = await this.getCardStubConfig(type, entityIds);
      return {
        ...{
          ...card,
          card: {
            ...card.card,
            isSuggested:
              card.card.isSuggested || SUGGESTED_CARDS.includes(type),
          },
        },
        stub: stubConfig,
      };
    });

    const cardsWithStub = await Promise.all(promises);

    const filter = this.filter;
    if (!filter) {
      return cardsWithStub;
    }

    return cardsWithStub.filter((card) => {
      return filter(card.stub);
    });
  }

  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this._load().catch((error) => {
      console.error("Error loading card picker:", error);
    });
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (this._done) {
      return;
    }

    const cardPickerEl = this._cardPickerEl;
    if (isUndefined(cardPickerEl) || !cardPickerEl._cards.length) {
      return;
    }

    this._transformCards(cardPickerEl._cards).then((cards) => {
      cardPickerEl._cards = cards;
      cardPickerEl.requestUpdate();
      this._done = true;
    });
  }

  protected get _spinner() {
    return html`
      <div>
        <ha-spinner size="small"></ha-spinner>
        <span>${t("components.card_picker.loading")}</span>
      </div>
    `;
  }

  render() {
    if (this._loading) {
      return this._spinner;
    }

    return html`
      ${!this._done ? this._spinner : nothing}
      <hui-card-picker
        class=${classMap({
          "visually-hidden": !this._done,
        })}
        aria-hidden=${!this._done}
        .hass=${this.hass}
        .lovelace=${this.lovelace}
        @config-changed=${(ev) => this.fireEvent("config-changed", ev)}
      ></hui-card-picker>
    `;
  }

  static styles = css`
    div:has(ha-spinner) {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
    }

    .visually-hidden {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;
}
