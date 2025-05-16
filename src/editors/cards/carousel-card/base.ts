import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardBaseConfig } from "../../../cards/carousel-card/types";
import { carouselCardAllowedStepperPositions } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { t } from "../../../localization/i18n";
import { mdiCursorMove } from "@mdi/js";
import { Position } from "../../../lib/layout/position";
import { editorBaseStyles } from "../../styles";
import {
  getLovelaceCardConfigElement,
  getLovelaceCardConfigForm,
} from "../../../lib/cards/helpers";
import { isUndefined, omit } from "../../../lib/helpers";
import {
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "../../../types/ha/lovelace";
import { state } from "lit/decorators.js";
import { Result, run } from "../../../lib/result";
import { Mutex, withTimeout } from "async-mutex";
import { CarouselStepperStyle } from "../../../components/bc-carousel";
import { enumToOptions } from "../../helpers";
import { Maybe, RenderResult } from "../../../lib/types";
import { HassUndefinedError } from "../../../lib/basic-hass-object";
import { Optional } from "../../../lib/optional";
import { EntitySelectorInner } from "../../../types/ha/selector";
import { BoldCardType } from "../../../lib/cards/types";
import { computeDomain } from "../../../helpers/entity";

type CardEntitiesEntrySelector = Omit<
  EntitySelectorInner,
  "multiple" | "exclude_entities"
>;

type CardEntitiesEntry = {
  availableEntities: string[];
  selector: CardEntitiesEntrySelector;
  // we are sure that the selector is valid, so don't show a warning
  isKnown: boolean;
};

type CardEditorEntry = {
  doesValidate: boolean;
  editor: Maybe<LovelaceCardEditor>;
  assertValid: Maybe<(config: LovelaceCardConfig) => void>;
};

const EMPTY_CARD_EDITOR_ENTRY: CardEditorEntry = {
  doesValidate: false,
  editor: undefined,
  assertValid: undefined,
};

const EMPTY_CARD_ENTITIES_ENTRY: CardEntitiesEntry = {
  availableEntities: [],
  selector: {},
  isKnown: false,
};

const knownEntitySelectors: Record<string, CardEntitiesEntrySelector> = {
  [BoldCardType.MEDIA_PLAYER]: {
    filter: {
      domain: ["media_player"],
    },
  },
  [BoldCardType.MINI_WEATHER]: {
    filter: {
      domain: ["weather"],
    },
  },
  ["tile"]: {},
  ["media-control"]: {
    filter: {
      domain: ["media_player"],
    },
  },
  ["weather-forecast"]: {
    filter: {
      domain: ["weather"],
    },
  },
  ["light"]: {
    filter: {
      domain: ["light"],
    },
  },
  ["humidifier"]: {
    filter: {
      domain: ["humidifier"],
    },
  },
  ["entity"]: {},
};

export abstract class BoldCarouselCardEditorBase<
  TConfig extends CarouselCardBaseConfig,
> extends BoldLovelaceCardEditor<TConfig> {
  @state() private _cardEditor: Map<string, CardEditorEntry> = new Map();
  @state() private _cardEntities: Map<string, CardEntitiesEntry> = new Map();
  private _loadCardEditorMutex = withTimeout(
    new Mutex(),
    100,
    new Error("Timeout loading card editor"),
  );
  private _loadEntitySelectorMutex = withTimeout(
    new Mutex(),
    100,
    new Error("Timeout loading available entities"),
  );

  protected get isLoading() {
    return (
      this._loadCardEditorMutex.isLocked() ||
      this._loadEntitySelectorMutex.isLocked()
    );
  }

  private async _loadCardEditor(type: string) {
    return await this._loadCardEditorMutex.runExclusive(() =>
      Result.runAsync<CardEditorEntry>(async () => {
        const editorResult = await getLovelaceCardConfigElement(type);

        if (editorResult.isOk()) {
          const editor = editorResult.get();
          editor.hass = this.hass;
          editor.lovelace = this.lovelace;

          // set an invalid config to check if the editor validates
          const doesValidate = run(() =>
            // @ts-expect-error
            editor.setConfig({
              ["__this_key_should_not_exist__"]: "__some_random_value__",
            }),
          ).isError();

          return {
            doesValidate,
            editor,
            assertValid: editor.setConfig.bind(editor),
          };
        }

        // if the editor is not found, the card might provide a form
        const formResult = await getLovelaceCardConfigForm(type);

        if (formResult.isOk()) {
          const assertValid = Optional.of(
            formResult.get().assertConfig,
          ).getOrThrow("Card provided a form but no assertConfig");

          return {
            doesValidate: true,
            editor: undefined,
            assertValid,
          };
        }

        throw new Error(
          `Failed to get config element or form for card ${type}: ${editorResult.error}; ${formResult.error}`,
        );
      }),
    );
  }

  private guessSelectorFromEntities(
    entities: string[],
  ): CardEntitiesEntrySelector {
    if (entities.length === 0) {
      return {};
    }

    const allEntities = this.getAllEntityIds();

    if (entities.length === allEntities.length) {
      return {};
    }

    const domains = [...new Set(entities.map(computeDomain))];

    if (domains.length <= 3) {
      return {
        filter: {
          domain: domains,
        },
      };
    }

    return {
      include_entities: entities,
    };
  }

  private async _loadCardEntitySelector(type: string) {
    return await this._loadEntitySelectorMutex.runExclusive(async () =>
      Result.runAsync<CardEntitiesEntry>(async () => {
        const entities = await this.getAllEntitiesForCard(type);

        const knownSelector = Optional.of(knownEntitySelectors[type]);

        return {
          availableEntities: entities,
          selector: knownSelector.getOrElse(() =>
            this.guessSelectorFromEntities(entities),
          ),
          isKnown: knownSelector.isPresent(),
        };
      }),
    );
  }

  // returns true if a new card editor was loaded and a refresh is needed
  protected async loadCard(type?: string) {
    return Result.runAsync(async () => {
      if (!this.hass || !this.lovelace) {
        throw new HassUndefinedError();
      }

      if (
        isUndefined(type) ||
        (this._cardEditor.has(type) && this._cardEntities.has(type))
      ) {
        return false;
      }

      const [editorEntryRes, entitiesEntryRes] = await Promise.all([
        this._loadCardEditor(type),
        this._loadCardEntitySelector(type),
      ]);

      const editorEntry = editorEntryRes
        .logError()
        .ifError(() =>
          this.errorToast(
            `Could not load validation for card ${this.getCardTypeName(type)}`,
          ),
        )
        .getOrElse(EMPTY_CARD_EDITOR_ENTRY);
      const entitiesEntry = entitiesEntryRes
        .logError()
        .ifError(() =>
          this.errorToast(
            `Could not get available entities for card ${this.getCardTypeName(type)}`,
          ),
        )
        .getOrElse(EMPTY_CARD_ENTITIES_ENTRY);

      this._cardEditor.set(type, editorEntry);
      this._cardEntities.set(type, entitiesEntry);

      return editorEntry.doesValidate; // if the editor does not validate, we don't need to refresh
    });
  }

  protected getCanValidateCardType(type: string) {
    return this._cardEditor.get(type)?.doesValidate ?? false;
  }

  protected getAvailableEntitiesForCard(type: string) {
    return this._cardEntities.get(type)?.availableEntities ?? [];
  }

  protected getEntitySelectorFor(type: string) {
    return this._cardEntities.get(type)?.selector ?? {};
  }

  protected getIsEntitySelectorKnownFor(type: string) {
    return this._cardEntities.get(type)?.isKnown ?? false;
  }

  protected validateCardConfig(config: LovelaceCardConfig) {
    const entry = this._cardEditor.get(config.type);
    const editor = entry?.editor;
    if (isUndefined(entry) || !entry.doesValidate || isUndefined(editor)) {
      return Result.void();
    }

    // remove card_mod to avoid validation errors
    const newConfig = omit(config, ["card_mod"]) as LovelaceCardConfig;

    return run(() => editor.setConfig(newConfig));
  }

  protected renderCarouselLayoutSection() {
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
                this.handleValueChanged("stepper_position", ev)}
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
                this.handleValueChanged("stepper_style", ev)}
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

  protected renderWith(renderFn: () => RenderResult) {
    return super.renderWith(() => {
      if (this.isLoading) {
        return this.renderSpinner({
          label: t("editor.card.carousel.helper_text.loading_editor"),
        });
      }

      return renderFn();
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
    `,
  ];
}
