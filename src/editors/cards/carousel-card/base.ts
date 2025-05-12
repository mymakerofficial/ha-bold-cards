import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardBaseConfig } from "../../../cards/carousel-card/types";
import { carouselCardAllowedStepperPositions } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { t } from "../../../localization/i18n";
import { mdiCursorMove } from "@mdi/js";
import { Position } from "../../../lib/layout/position";
import { editorBaseStyles } from "../../styles";
import { getLovelaceCardElementClass } from "../../../lib/cards/helpers";
import { isUndefined, omit, toPromise } from "../../../lib/helpers";
import {
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "../../../types/ha/lovelace";
import { state } from "lit/decorators.js";
import { isErrorResult, run, successResult } from "../../../lib/result";
import { Mutex, withTimeout } from "async-mutex";
import { CarouselStepperStyle } from "../../../components/bc-carousel";
import { enumToOptions } from "../../helpers";
import { Optional } from "../../../lib/types";

type CardEntities = {
  availableEntities: Optional<string[]>;
  all: boolean;
  error: boolean;
};

type CardEditorEntry = {
  doesValidate: boolean;
  entities: CardEntities;
  editor: Optional<LovelaceCardEditor>;
};

export abstract class BoldCarouselCardEditorBase<
  TConfig extends CarouselCardBaseConfig,
> extends BoldLovelaceCardEditor<TConfig> {
  private _cardEditor: Map<string, CardEditorEntry> = new Map();
  private _loadCardEditorMutex = new Mutex();
  private _loadEntitiesMutex = withTimeout(
    new Mutex(),
    100,
    new Error("Timeout loading available entities"),
  );

  @state() protected _isLoadingCardEditor = false;

  // returns true if a new card editor was loaded
  protected async _loadCardEditor(type?: string) {
    if (
      !this.hass ||
      !this.lovelace ||
      isUndefined(type) ||
      this._cardEditor.has(type)
    ) {
      return false;
    }

    this._isLoadingCardEditor = true;

    const entities: CardEntities = await this._loadEntitiesMutex
      .runExclusive(async () => {
        const entities = await this.getEntitiesForCard(
          type,
          this.getAllEntityIds(),
          Infinity,
        );

        if (type === "tile") {
          return {
            availableEntities: entities,
            all: true,
            error: false,
          };
        }

        if (entities.length === 0) {
          return {
            availableEntities: undefined,
            all: false,
            error: false,
          };
        }

        return {
          availableEntities: entities,
          all: false,
          error: false,
        };
      })
      .catch((error) => {
        console.log(error);
        return {
          availableEntities: undefined,
          all: false,
          error: true,
        }; // took too long or something else went wrong
      });

    return await this._loadCardEditorMutex
      .runExclusive(async () => {
        const cardClass = getLovelaceCardElementClass(type);

        if (isUndefined(cardClass.getConfigElement)) {
          throw new Error(`Card ${type} does not have a config element`);
        }

        const editor = await toPromise(cardClass.getConfigElement());
        editor.hass = this.hass;
        editor.lovelace = this.lovelace;

        const invalidConfigResult = run(() =>
          // @ts-expect-error
          editor.setConfig({
            ["__this_key_should_not_exist__"]: "__some_random_value",
          }),
        );

        this._cardEditor.set(type, {
          doesValidate: isErrorResult(invalidConfigResult),
          entities,
          editor,
        });
      })
      .catch((error) => {
        console.warn(`Failed to load card editor for ${type}`, error);
        this._isLoadingCardEditor = false;
        this._cardEditor.set(type, {
          doesValidate: false,
          entities,
          editor: undefined,
        });
        return false;
      })
      .then(() => {
        this._isLoadingCardEditor = false;
        return true;
      });
  }

  protected _canValidateCardType(type: string) {
    return this._cardEditor.get(type)?.doesValidate ?? false;
  }

  protected _getEntitiesFor(type: string) {
    return (
      this._cardEditor.get(type)?.entities ?? {
        availableEntities: undefined,
        all: false,
        error: true,
      }
    );
  }

  protected _getEntitiesSelectorFilter(type: string) {
    const { availableEntities, all, error } = this._getEntitiesFor(type);

    if (error) {
      return {};
    }

    if (all) {
      return {};
    }

    if (availableEntities) {
      return {
        include_entities: availableEntities,
      };
    }

    return {};
  }

  protected _validateCardConfig(config: LovelaceCardConfig) {
    const entry = this._cardEditor.get(config.type);
    const editor = entry?.editor;
    if (isUndefined(entry) || !entry.doesValidate || isUndefined(editor)) {
      return successResult(undefined);
    }

    // remove card_mod to avoid validation errors
    const newConfig = omit(config, ["card_mod"]) as LovelaceCardConfig;

    return run(() => editor.setConfig(newConfig));
  }

  protected _renderCarouselLayoutSection() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiCursorMove}></ha-svg-icon>
          ${t("editor.card.carousel.label.layout")}
        </h3>
        <div class="content flex-col-small">
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
          <bc-form-element
            .label=${t("editor.card.carousel.label.stepper_style")}
          >
            <bc-selector-select
              .hass=${this.hass}
              .value=${this._config.stepper_style}
              .default=${CarouselStepperStyle.DOTS}
              @value-changed=${(ev) =>
                this._handleValueChanged("stepper_style", ev)}
              .selector=${{
                select: {
                  mode: "dropdown",
                  options: enumToOptions(CarouselStepperStyle, {
                    labelScope: "common.carousel_stepper_style",
                  }),
                },
              }}
            ></bc-selector-select>
          </bc-form-element>
        </div>
      </ha-expansion-panel>
    `;
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
