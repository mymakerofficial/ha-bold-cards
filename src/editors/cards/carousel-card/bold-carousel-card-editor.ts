import { BoldLovelaceCardEditor } from "../base";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import {
  LovelaceCardEditor,
  LovelaceCardEditorContext,
} from "../../../types/ha/lovelace";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { isUndefined, toPromise } from "../../../lib/helpers";
import { LovelaceCardConfigWithEntity } from "../../../types/card";
import {
  getCardEditorTag,
  getLovelaceCardElementClass,
} from "../../../lib/cards/helpers";
import { PropertyValues } from "lit-element";
import { assert } from "superstruct";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { getCarouselCardConfig } from "../../../cards/carousel-card/helpers";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  protected _cardEditor?: LovelaceCardEditor;

  @state() private _loadingCardEditor = false;

  protected get _struct() {
    return carouselCardConfigStruct;
  }

  public setConfig(config: CarouselCardConfig): void {
    assert(config, this._struct);
    this._cardEditor?.setConfig(getCarouselCardConfig({ config }));
    this._config = config;
  }

  protected willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("_config") &&
      !!changedProperties.get("_config")?.card?.type &&
      !!this._config?.card?.type &&
      this._config?.card?.type !== changedProperties.get("_config")?.card?.type
    ) {
      this._loadEditor().then();
    }
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = [{}];

    const context: LovelaceCardEditorContext = {
      internals: {
        parent_card_type: BoldCardType.CAROUSEL,
      },
    };

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabelCallback}
        .computeHelper=${this._computeHelperCallback}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabelCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.entity_carousel.label",
    });
  };

  private _computeHelperCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.entity_carousel.helper_text",
      defaultValue: "",
    });
  };

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

  private async _loadEditor() {
    if (isUndefined(this._config) || isUndefined(this._config.card)) {
      return;
    }

    const cardClass = getLovelaceCardElementClass(this._config.card.type);

    this._loadingCardEditor = true;
    this._cardEditor = undefined;

    if (isUndefined(cardClass.getConfigElement)) {
      return;
    }

    this._cardEditor = await toPromise(cardClass.getConfigElement());

    this._loadingCardEditor = false;
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
