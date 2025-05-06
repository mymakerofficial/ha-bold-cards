import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardBaseConfig } from "../../../cards/carousel-card/types";
import { carouselCardAllowedStepperPositions } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { t } from "../../../localization/i18n";
import { mdiCursorMove } from "@mdi/js";
import { Position } from "../../../lib/layout/position";
import { editorBaseStyles } from "../../styles";
import { getLovelaceCardElementClass } from "../../../lib/cards/helpers";
import { isUndefined, toPromise } from "../../../lib/helpers";
import {
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "../../../types/ha/lovelace";
import { state } from "lit/decorators.js";
import { isErrorResult, run, successResult } from "../../../lib/result";
import { Mutex } from "async-mutex";

export abstract class BoldCarouselCardEditorBase<
  TConfig extends CarouselCardBaseConfig,
> extends BoldLovelaceCardEditor<TConfig> {
  private _cardEditor: Map<
    string,
    { doesValidate: boolean; editor: LovelaceCardEditor }
  > = new Map();
  private _loadCardEditorMutex = new Mutex();

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

    return await this._loadCardEditorMutex
      .runExclusive(async () => {
        const cardClass = getLovelaceCardElementClass(type);

        if (isUndefined(cardClass.getConfigElement)) {
          return;
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
          editor,
        });
      })
      .then(() => {
        this._isLoadingCardEditor = false;
        return true;
      });
  }

  protected _canValidateCardType(type: string) {
    return this._cardEditor.get(type)?.doesValidate ?? false;
  }

  protected _validateCardConfig(config: LovelaceCardConfig) {
    const entry = this._cardEditor.get(config.type);

    if (isUndefined(entry) || !entry.doesValidate) {
      return successResult(undefined);
    }

    return run(() => entry.editor.setConfig(config));
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
        <div class="content">
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
