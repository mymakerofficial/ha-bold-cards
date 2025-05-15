import { html, nothing } from "lit";
import { customElement, state } from "lit/decorators";
import {
  LovelaceCardConfig,
  LovelaceCardEditorContext,
} from "../../../types/ha/lovelace";
import { BoldCardType } from "../../../lib/cards/types";
import { t } from "../../../localization/i18n";
import { isDefined, isEmpty, isUndefined } from "../../../lib/helpers";
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
  @state() private _isEditingCard = false;
  @state() private _isPickingCard = false;

  protected get _struct() {
    return entityCarouselCardConfigStruct;
  }

  public setConfig(config: EntityCarouselCardConfig): void {
    // ensure the card editor is loaded, if a new one was loaded, reload the error to validate
    this._loadCardEditor(config.card?.type).then((didChange) => {
      if (didChange) {
        this._reload();
      }
    });

    // validate card config with all entities
    if (this._canValidateCardType(config.card?.type)) {
      config.entities.forEach((_, index) => {
        const cardConfig = getEntityCarouselCardConfig({
          config,
          index,
        });
        return this._validateCardConfig(cardConfig).throwIfError(
          (error) => new Error(`Invalid card config: ${error.message}`),
        );
      });
    }

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

    const cardConfig = getEntityCarouselCardConfig({
      config: this._config,
    });

    const context: LovelaceCardEditorContext = {
      internals: {
        parent_card_type: BoldCardType.ENTITY_CAROUSEL,
      },
    };

    if (isUndefined(this._config.card) || this._isPickingCard) {
      return this._renderSubEditor({
        title: t("editor.card.entity_carousel.label.pick_card"),
        onBack: () => (this._isPickingCard = false),
        showHeader: isDefined(this._config.card),
        content: html`
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

    if (this._isEditingCard) {
      return this._renderSubEditor({
        title: this.getCardTypeName(cardConfig.type),
        onBack: () => (this._isEditingCard = false),
        content: html`
          <bc-form-help-box
            .header=${t("editor.card.entity_carousel.helper_text.card_editor")}
            .icon=${"mdi:alert-outline"}
          ></bc-form-help-box>
          <hui-card-element-editor
            .hass=${this.hass}
            .value=${cardConfig}
            .lovelace=${this.lovelace}
            .context=${context}
            @config-changed=${this._handleCardConfigChanged}
          ></hui-card-element-editor>
        `,
      });
    }

    const entities = this._getEntitiesFor(this._config.card.type);
    const entitiesSelectorFilter = this._getEntitiesSelectorFilter(
      this._config.card.type,
    );

    const noneAvailableEntitiesSelected =
      (!entities.all &&
        !!entities.availableEntities &&
        this._config.entities.filter(
          (entity) => !entities.availableEntities?.includes(entity),
        )) ||
      undefined;

    console.log(entities, noneAvailableEntitiesSelected);

    return html`
      <div class="panel">
        <ha-button raised @click="${() => (this._isEditingCard = true)}">
          ${t("editor.card.entity_carousel.label.edit_card")}
          <ha-svg-icon .path=${mdiPencil} slot="icon"></ha-svg-icon>
        </ha-button>
        <ha-button @click=${() => (this._isPickingCard = true)}>
          ${t("editor.card.entity_carousel.label.change_card_type")}
        </ha-button>
      </div>
      ${this._renderCarouselLayoutSection()}
      <ha-expansion-panel outlined expanded>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiDevices}></ha-svg-icon>
          ${t("editor.card.entity_carousel.label.entities")}
        </h3>
        <div class="content flex-col-small">
          ${!entities.all && !!entities.availableEntities?.length
            ? html`
                <bc-form-help-box
                  .header=${`This card supports ${entities.availableEntities.length} of your entities.`}
                  .content=${`For your convenience, your selection has been pre-filled.`}
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
          ${!!noneAvailableEntitiesSelected?.length
            ? html`
                <bc-form-help-box
                  .header=${`Unsupported entities selected.`}
                  .content=${`You have selected entities that might not supported by this card. They will still be filled in, but might cause errors.`}
                  .icon=${"mdi:alert-outline"}
                  .actions=${html`<ha-button slot="action" @click=${() => {}}>
                      Remove unsupported
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
                    ...entitiesSelectorFilter,
                  },
                },
              },
            ]}
            .computeLabel=${this._computeLabelCallback}
            .computeHelper=${this._computeHelperCallback}
            @value-changed=${this._formValueChanged}
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
                this._handleValueChanged("remove_inactive_entities", ev)}
            ></ha-selector>
          </bc-form-element>
        </div>
      </ha-expansion-panel>
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

  private _handleCardConfigChanged(
    ev: CustomEvent<{ config?: LovelaceCardConfigWithEntity }>,
  ): void {
    ev.stopPropagation();

    const config = ev.detail.config;
    if (!config) {
      return;
    }

    const card = stripCarouselCardConfig(config);
    this._patchConfig({
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

    await this._loadCardEditor(card.type);

    const entities = isEmpty(config.entities)
      ? (this._getEntitiesFor(card.type).availableEntities?.slice(0, 6) ??
        config.entities)
      : config.entities; // keep old entities

    this._patchConfig({
      card,
      entities,
    });

    this._isPickingCard = false;
    this._isEditingCard = false;
  }
}
