import { BoldLovelaceCardEditor } from "../base";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { LovelaceCardConfigWithEntity } from "../../../types/card";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";

@customElement(getCardEditorTag(BoldCardType.CAROUSEL))
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  protected get _struct() {
    return carouselCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = [{}];

    return html`
      <p>foo</p>
      <pre>${JSON.stringify(this._config)}</pre>
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
