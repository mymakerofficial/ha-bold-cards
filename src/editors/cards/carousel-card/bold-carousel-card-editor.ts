import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import {
  LovelaceCardConfig,
  LovelaceCardEditorContext,
} from "../../../types/ha/lovelace";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { isUndefined } from "../../../lib/helpers";
import { LovelaceCardConfigWithEntity } from "../../../types/card";

const TAB = {
  CAROUSEL: 0,
  CARD: 1,
} as const;

@customElement("bold-carousel-card-editor")
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  @state() private _selectedTab = 1;

  protected get _struct() {
    return carouselCardConfigStruct;
  }

  private _handleSelectTab(ev: CustomEvent<{ index: number }>): void {
    this._selectedTab = ev.detail.index;
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

    const showCarouselForm = this._selectedTab === TAB.CAROUSEL;

    const showCardPicker =
      this._selectedTab === TAB.CARD && isUndefined(this._config.card);

    const showCardEditor = this._selectedTab === TAB.CARD && !showCardPicker;

    return html`
      <mwc-tab-bar
        .activeIndex=${this._selectedTab}
        @MDCTabBar:activated=${this._handleSelectTab}
      >
        <mwc-tab .label=${t("editor.card.carousel.tab.carousel")}></mwc-tab>
        <mwc-tab .label=${t("editor.card.carousel.tab.card")}></mwc-tab>
      </mwc-tab-bar>
      ${showCarouselForm
        ? html`<ha-form
            .hass=${this.hass}
            .data=${this._config}
            .schema=${schema}
            .computeLabel=${this._computeLabelCallback}
            .computeHelper=${this._computeHelperCallback}
            @value-changed=${this._valueChanged}
          ></ha-form>`
        : nothing}
      ${showCardPicker
        ? html`<bc-card-picker
            .hass=${this.hass}
            .lovelace=${this.lovelace}
            .filter=${(card: LovelaceCardConfig) => {
              return (
                Object.keys(card).includes("entity") &&
                this.getAllEntityIds().includes(card.entity)
              );
            }}
            @config-changed=${this._handleCardPicked}
          ></bc-card-picker>`
        : nothing}
      ${showCardEditor
        ? html`
            <ha-alert alert-type="info">
              The entity field in this editor is ignored. Please use the
              entities field in the carousel card editor.
            </ha-alert>
            <hui-card-element-editor
              .hass=${this.hass}
              .value=${cardConfig}
              .lovelace=${this.lovelace}
              .context=${context}
              @config-changed=${this._handleCardConfigChanged}
            ></hui-card-element-editor>
            <div>
              <ha-button @click=${this._handleRemoveCard}>
                ${t("editor.card.carousel.label.change_card_type")}
              </ha-button>
            </div>
          `
        : nothing}
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

  private _stripCardConfig(config: LovelaceCardConfigWithEntity) {
    const {
      entity: _entity,
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

  private _handleCardConfigChanged(
    ev: CustomEvent<{ config?: LovelaceCardConfigWithEntity }>,
  ): void {
    ev.stopPropagation();

    const config = ev.detail.config;
    if (!config) {
      return;
    }

    this.fireEvent("config-changed", {
      config: {
        ...this._config,
        card: this._stripCardConfig(config),
        entities: [config.entity, ...(this._config?.entities ?? []).slice(1)],
      },
    });
  }

  private _handleCardPicked(
    ev: CustomEvent<{ config?: LovelaceCardConfigWithEntity }>,
  ): void {
    ev.stopPropagation();

    const config = ev.detail.config;
    if (!config) {
      return;
    }

    this.fireEvent("config-changed", {
      config: {
        ...this._config,
        card: this._stripCardConfig(config),
        entities: [config.entity],
      },
    });
  }

  private _handleRemoveCard(ev: CustomEvent): void {
    ev.stopPropagation();
    this.fireEvent("config-changed", {
      config: {
        ...this._config,
        card: undefined,
        entities: [],
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
