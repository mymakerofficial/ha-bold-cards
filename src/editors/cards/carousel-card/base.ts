import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardBaseConfig } from "../../../cards/carousel-card/types";
import { carouselCardAllowedStepperPositions } from "../../../cards/carousel-card/struct";
import { css, CSSResultGroup, html, nothing } from "lit";
import { t } from "../../../localization/i18n";
import { mdiCursorMove } from "@mdi/js";
import { Position } from "../../../lib/layout/position";
import { editorBaseStyles } from "../../styles";

export abstract class BoldCarouselCardEditorBase<
  TConfig extends CarouselCardBaseConfig,
> extends BoldLovelaceCardEditor<TConfig> {
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
