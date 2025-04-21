import { customElement, property, query, state } from "lit/decorators";
import { html, LitElement } from "lit";
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

  private async _filterCard(cards: CardElement[]) {
    if (!this.filter) {
      return cards;
    }

    const entityIds = this.getAllEntityIds();

    const promises = cards.map(async (card) => {
      const stubConfig = await this.getCardStubConfig(
        optionallyPrefixCustomType(card.card.type, card.card.isCustom),
        entityIds,
      );
      return {
        ...card,
        stub: stubConfig,
      };
    });

    return (await Promise.all(promises)).filter((card) => {
      return this.filter!(card.stub);
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

    if (isUndefined(this.filter) || this._done) {
      return;
    }

    if (this._cardPickerEl?._cards?.length) {
      this._filterCard(this._cardPickerEl._cards).then((cards) => {
        if (this._cardPickerEl!._cards.length !== cards.length) {
          this._cardPickerEl!._cards = cards;
          this._cardPickerEl!.requestUpdate();
        }
        this._done = true;
      });
    }
  }

  render() {
    if (this._loading) {
      return html`<ha-spinner size="small"></ha-spinner>`;
    }

    return html`<hui-card-picker
      .hass=${this.hass}
      .lovelace=${this.lovelace}
      @config-changed=${(ev) => this.fireEvent("config-changed", ev)}
    ></hui-card-picker>`;
  }
}
