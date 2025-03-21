import { BoldLovelaceCardEditor } from "../base";
import { CarouselCardConfig } from "../../../cards/carousel-card/types";
import { carouselCardConfigStruct } from "../../../cards/carousel-card/struct";
import { html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { LovelaceCardEditorContext } from "../../../types/ha/lovelace";
import { fireEvent } from "custom-card-helpers";
import { BoldCardType } from "../../../lib/cards/types";

@customElement("bold-carousel-card-editor")
export class BoldCarouselCardEditor extends BoldLovelaceCardEditor<CarouselCardConfig> {
  protected get _struct() {
    return carouselCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

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
      <hui-card-element-editor
        .hass=${this.hass}
        .value=${cardConfig}
        .lovelace=${this.lovelace}
        .context=${context}
        @config-changed=${this._handleConfigChanged}
      ></hui-card-element-editor>
    `;
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
}
