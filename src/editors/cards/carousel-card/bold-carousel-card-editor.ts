import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { LovelaceCardEditorContext } from "../../../types/ha/lovelace";
import { fireEvent } from "custom-card-helpers";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

@customElement("bold-carousel-card-editor")
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  protected get _struct() {
    return carouselCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = [
      {
        name: "entities",
        selector: { entity: { multiple: true } },
      },
    ];

    const cardConfig = {
      entity: this._config.entities[0],
      ...this._config.card,
    };

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
      <div class="description">
        ${unsafeHTML(t("editor.card.carousel.description"))}
      </div>
      <hr />
      <hui-card-element-editor
        .hass=${this.hass}
        .value=${cardConfig}
        .lovelace=${this.lovelace}
        .context=${context}
        @config-changed=${this._handleConfigChanged}
      ></hui-card-element-editor>
    `;
  }

  private _computeLabelCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.carousel.label",
    });
  };

  private _computeHelperCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.carousel.helper_text",
      defaultValue: "",
    });
  };

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    fireEvent(this, "config-changed", { config: ev.detail.value });
  }

  private _handleConfigChanged(ev: CustomEvent): void {
    ev.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    const { entity: _entity, ...card } = ev.detail.config;

    fireEvent(this, "config-changed", {
      config: {
        ...this._config,
        card,
      },
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
