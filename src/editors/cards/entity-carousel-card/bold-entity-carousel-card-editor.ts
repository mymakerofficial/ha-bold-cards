import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { LovelaceCardConfig } from "../../../types/ha/lovelace";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { isDefined, isEmpty, isUndefined, toArray } from "../../../lib/helpers";
import { LovelaceCardConfigWithEntity } from "../../../types/card";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { getEntityCarouselCardConfig } from "../../../cards/entity-carousel-card/helpers";
import { entityCarouselCardConfigStruct } from "../../../cards/entity-carousel-card/struct";
import { EntityCarouselCardConfig } from "../../../cards/entity-carousel-card/types";
import { mdiDevices, mdiPencil } from "@mdi/js";
import { BoldCarouselCardEditorBase } from "../carousel-card/base";
import { stripCarouselCardConfig } from "../../../cards/carousel-card/helpers";

@customElement(getCardEditorTag(BoldCardType.ENTITY_CAROUSEL))
export class BoldEntityCarouselCardEditor extends BoldCarouselCardEditorBase<EntityCarouselCardConfig> {
  protected get _struct() {
    return entityCarouselCardConfigStruct;
  }

  public setConfig(config: EntityCarouselCardConfig): void {
    // ensure the card editor is loaded, if a new one was loaded, reload the error to validate
    this.loadCard(config.card?.type).then((didChange) => {
      if (didChange.get()) {
        this.forceReloadEditor()
          .ifError(() =>
            this.errorToast("Failed to refresh editor, validation may fail"),
          )
          .logError();
      }
    });

    // validate card config with all entities
    if (this.getCanValidateCardType(config.card?.type)) {
      config.entities.forEach((_, index) => {
        const cardConfig = getEntityCarouselCardConfig({
          config,
          index,
        });
        this.validateCardConfig(cardConfig).throwIfError(
          (error) => `Invalid card config: ${error.message}`,
        );
      });
    }

    super.setConfig(config);

    if (isUndefined(config.card)) {
      this.openPickCard();
    }
  }

  protected openPickCard() {
    return this.openSubEditor({
      title: t("editor.card.entity_carousel.label.pick_card"),
      showBack: isDefined(this._config?.card),
      render: () => html`
        <bc-card-picker
          .hass=${this.hass}
          .lovelace=${this.lovelace}
          .filter=${(card: LovelaceCardConfig) => {
            return (
              card.type !== BoldCardType.CAROUSEL &&
              card.type !== BoldCardType.ENTITY_CAROUSEL &&
              Object.keys(card).includes("entity") &&
              this.getAllEntityIds().includes(card.entity)
            );
          }}
          @config-changed=${this._handleCardPicked}
        ></bc-card-picker>
      `,
    });
  }

  protected openEditCard() {
    const cardConfig = getEntityCarouselCardConfig({
      config: this._config!,
    });

    this.openSubEditor({
      title: this.getCardTypeName(cardConfig.type),
      renderHeaderActions: () => html`
        <ha-button outlined @click=${() => this.openPickCard()}>
          ${t("editor.card.entity_carousel.label.change_card_type")}
        </ha-button>
      `,
      render: () => html`
        <bc-form-help-box
          .header=${t("editor.card.entity_carousel.helper_text.card_editor")}
          .icon=${"mdi:alert-outline"}
        ></bc-form-help-box>
        <hui-card-element-editor
          .hass=${this.hass}
          .value=${cardConfig}
          .lovelace=${this.lovelace}
          @config-changed=${this._handleCardConfigChanged}
        ></hui-card-element-editor>
      `,
    });
  }

  protected render() {
    return this.renderWith(() => {
      if (!this.hass || !this._config || !this._config.card) {
        return nothing;
      }

      const selector = this.getEntitySelectorFilterFor(this._config.card.type);

      const domains = toArray(selector.filter).flatMap((it) =>
        toArray(it.domain),
      );

      const alertContent = t(
        !isEmpty(domains) ? "by_domain" : "none_specific",
        {
          scope:
            "editor.card.entity_carousel.helper_text.entities_pre_filtered.content",
          domain: domains.join(", "),
        },
      );

      return html`
        <ha-button
          class="primary-button"
          raised
          @click="${() => this.openEditCard()}"
        >
          ${t("editor.card.entity_carousel.label.edit_card")}
          <ha-svg-icon .path=${mdiPencil} slot="icon"></ha-svg-icon>
        </ha-button>
        ${this.renderCarouselLayoutSection()}
        <ha-expansion-panel outlined expanded>
          <h3 slot="header">
            <ha-svg-icon .path=${mdiDevices}></ha-svg-icon>
            ${t("editor.card.entity_carousel.label.entities")}
          </h3>
          <div class="content flex-col-small">
            ${isDefined(selector.include_entities) || isDefined(selector.filter)
              ? html`
                  <bc-form-help-box
                    .header=${t(
                      "editor.card.entity_carousel.helper_text.entities_pre_filtered.header",
                    )}
                    .content=${alertContent}
                    .icon=${"mdi:information-outline"}
                    .actions=${html`<ha-button slot="action" @click=${() => {}}>
                        Allow all entities
                      </ha-button>
                      <ha-button slot="action" @click=${() => {}}>
                        Dismiss
                      </ha-button>`}
                  ></bc-form-help-box>
                `
              : nothing}
            <ha-form
              .hass=${this.hass}
              .data=${this._config}
              .schema=${[
                {
                  name: "entities",
                  selector: {
                    entity: {
                      multiple: true,
                      ...selector,
                    },
                  },
                },
              ]}
              .computeLabel=${this._computeLabelCallback}
              .computeHelper=${this._computeHelperCallback}
              @value-changed=${this.handleFormValueChanged}
            ></ha-form>
            <bc-form-element
              .label=${t(
                "editor.card.entity_carousel.label.remove_inactive_entities",
              )}
            >
              <ha-selector
                .selector=${{
                  boolean: {},
                }}
                .value=${this._config?.remove_inactive_entities ?? false}
                @value-changed=${(ev) =>
                  this.handleValueChanged("remove_inactive_entities", ev)}
              ></ha-selector>
            </bc-form-element>
          </div>
        </ha-expansion-panel>
      `;
    });
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

  private _handleCardConfigChanged(
    ev: CustomEvent<{ config?: LovelaceCardConfigWithEntity }>,
  ): void {
    ev.stopPropagation();

    const config = ev.detail.config;
    if (!config) {
      return;
    }

    const card = stripCarouselCardConfig(config);
    this.patchConfig({
      card,
    });
  }

  private async _handleCardPicked(
    ev: CustomEvent<{ config?: LovelaceCardConfigWithEntity }>,
  ) {
    ev.stopPropagation();

    const config = this._config;
    const newCardConfig = ev.detail.config;
    if (isUndefined(config) || isUndefined(newCardConfig)) {
      return;
    }

    const card = stripCarouselCardConfig(newCardConfig);

    await this.loadCard(card.type);

    const entities = isEmpty(config.entities)
      ? (this.getAvailableEntitiesForCard(card.type).slice(0, 6) ??
        config.entities)
      : config.entities; // keep old entities

    this.patchConfig({
      card,
      entities,
    });

    this.closeAllSubEditors();
  }

  static get styles() {
    return [
      super.styles,
      css`
        .primary-button {
          --button-height: 63px;
        }
      `,
    ];
  }
}
