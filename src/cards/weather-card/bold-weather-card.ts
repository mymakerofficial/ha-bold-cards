import { HomeAssistant, LovelaceGridOptions } from "../../types/ha/lovelace";
import { BoldCardType } from "../../lib/cards/types";
import { customElement } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldCardWithEntity } from "../base";
import { WeatherCardConfig } from "./types";
import { unsafeCSS, css, html, nothing } from "lit";
import { WeatherEntity } from "../../lib/weather/types";
import { isMediaPlayerEntity, isStateActive } from "../../helpers/states";
import { randomFrom } from "../../lib/helpers";
import { isWeatherEntity } from "../../lib/weather/guards";
import {
  getStubWeatherEntity,
  getWeatherIcon,
} from "../../lib/weather/helpers";

const MASK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(0.130675,0.130675,-0.121235,0.121235,40.4567,-42.954)">
          <path d="M619.788,279.216L619.788,408.794C619.788,544.195 517.802,654.124 392.183,654.124C266.564,654.124 164.577,544.195 164.577,408.794L164.577,279.216C164.577,143.815 266.564,33.887 392.183,33.887C517.802,33.887 619.788,143.815 619.788,279.216Z"/>
        </g>
      </svg>
    `)}`;

const cardType = BoldCardType.WEATHER;

@customElement(stripCustomPrefix(cardType))
export class BoldWeatherCard extends BoldCardWithEntity<
  WeatherCardConfig,
  WeatherEntity
> {
  static get cardType() {
    return cardType;
  }

  public static getStubConfig(hass?: HomeAssistant): WeatherCardConfig {
    const entity = getStubWeatherEntity(hass);
    return {
      type: this.cardType,
      entity: entity?.entity_id ?? "",
    };
  }

  public getCardSize() {
    return 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 4,
      rows: 2,
      min_columns: 4,
      min_rows: 2,
    };
  }

  protected render() {
    const stateObj = this._stateObj;

    if (!this._config || !stateObj) {
      return nothing;
    }

    const temperature = Math.round(stateObj.attributes.temperature || 0);
    const icon = getWeatherIcon(stateObj.state);

    return html`<div class="content">
      <bc-icon class="icon" icon=${icon}></bc-icon>
      <div class="label">${temperature}˚</div>
    </div>`;
  }

  static get styles() {
    return css`
      :host {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .content {
        height: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        background: var(
          --ha-card-background,
          var(--card-background-color, #fff)
        );
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-position: center;
        mask-position: center;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-image: url("${unsafeCSS(MASK_IMAGE)}");
        mask-image: url("${unsafeCSS(MASK_IMAGE)}");
      }

      .icon {
        position: absolute;
        bottom: 35%;
        left: 38%;
        transform: translate(-50%, 50%);
        width: 50%;
        height: 50%;
        z-index: 1;
      }

      .label {
        font-size: 300%;
        font-weight: 700;
        line-height: 1;
        position: absolute;
        top: 17%;
        left: 61%;
        transform: translate(-50%, 0);
        text-align: center;
      }
    `;
  }
}

BoldWeatherCard.registerCustomCard({
  name: "Bold Weather Card",
  description: "A weather card.",
  preview: true,
});
