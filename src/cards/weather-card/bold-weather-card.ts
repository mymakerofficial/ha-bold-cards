import {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { BoldCardType } from "../../lib/cards/types";
import { customElement } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldCardWithEntity } from "../base";
import { WeatherCardConfig, WeatherCardShape } from "./types";
import { css, html, nothing, svg, unsafeCSS } from "lit";
import { WeatherEntity } from "../../lib/weather/types";
import {
  getStubWeatherEntity,
  getWeatherIcon,
} from "../../lib/weather/helpers";
import { HassEntity } from "home-assistant-js-websocket";
import { fireEvent } from "custom-card-helpers";

const PILL_MASK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(0.130675,0.130675,-0.121235,0.121235,40.4567,-42.954)">
          <path d="M619.788,279.216L619.788,408.794C619.788,544.195 517.802,654.124 392.183,654.124C266.564,654.124 164.577,544.195 164.577,408.794L164.577,279.216C164.577,143.815 266.564,33.887 392.183,33.887C517.802,33.887 619.788,143.815 619.788,279.216Z"/>
        </g>
      </svg>
    `)}`;

const SCALLOP_MASK_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
      <svg width="100%" height="100%" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(0.15873,0,0,0.15873,-13.4921,-13.4921)">
          <path d="M272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C699.791,328.825 715,362.65 715,400C715,437.35 699.791,471.175 675.243,495.626C666.795,504.039 662.032,515.462 661.999,527.384C661.795,601.589 601.589,661.795 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001Z"/>
        </g>
      </svg>
    `)}`;

const cardType = BoldCardType.WEATHER;

@customElement(stripCustomPrefix(cardType))
export class BoldWeatherCard extends BoldCardWithEntity<
  WeatherCardConfig,
  WeatherEntity
> {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("../../editors/cards/weather-card/bold-weather-card-editor");
    return document.createElement(
      "bold-weather-card-editor",
    ) as LovelaceCardEditor;
  }

  static get cardType() {
    return cardType;
  }

  public static getStubConfig(hass?: HomeAssistant): WeatherCardConfig {
    const entity = getStubWeatherEntity(hass);
    return {
      type: this.cardType,
      entity: entity?.entity_id ?? "",
      shape: WeatherCardShape.PILL,
    };
  }

  public getCardSize() {
    return 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 3,
      rows: 2,
      min_columns: 3,
      min_rows: 2,
    };
  }

  protected get _temperatureEntityStateObj() {
    if (!this._config?.temperature_entity) {
      return undefined;
    }
    const entityId = this._config.temperature_entity;
    return this.hass?.states[entityId] as HassEntity | undefined;
  }

  protected render() {
    const stateObj = this._stateObj;

    if (!this._config || !stateObj) {
      return nothing;
    }

    const temperatureStateObj = this._temperatureEntityStateObj;
    const temperature = Math.round(
      Number(
        temperatureStateObj?.state ?? stateObj.attributes.temperature ?? 0,
      ),
    );

    const time = new Date(stateObj.last_changed).getHours();
    const isNight = time < 6 || time > 18;
    const icon = getWeatherIcon(stateObj.state, isNight);

    const labelSvg = svg`
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${temperature}˚</text>
      </svg>
    `;

    return html` <div
      class="container"
      data-shape=${this._config.shape ?? WeatherCardShape.RECTANGLE}
    >
      <div class="content">
        <button
          class="background"
          role="button"
          tabindex="0"
          aria-label="More Info"
          @click=${this._handleMoreInfo}
        >
          <ha-ripple></ha-ripple>
        </button>
        <div class="icon-container">
          <bc-icon icon=${icon}></bc-icon>
        </div>
        <div class="label-container">${labelSvg}</div>
      </div>
    </div>`;
  }

  protected _handleMoreInfo() {
    fireEvent(this, "hass-more-info", {
      entityId: this._config!.entity,
    });
  }

  static get styles() {
    return css`
      [role="button"] {
        cursor: pointer;
        pointer-events: auto;
      }

      [role="button"]:focus {
        outline: none;
      }

      :host {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        --state-color: var(--primary-color);
        --state-icon-color: var(--primary-color);
        --ha-ripple-color: var(--primary-color);
        --ha-ripple-hover-opacity: 0.04;
        --ha-ripple-pressed-opacity: 0.12;
      }

      .container {
        max-height: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .container[data-shape="${unsafeCSS(WeatherCardShape.RECTANGLE)}"] {
        --border-radius: var(--ha-card-border-radius, 12px);
        height: 100%;
        width: 100%;
        aspect-ratio: unset;
      }

      .container[data-shape="${unsafeCSS(WeatherCardShape.PILL)}"] {
        --mask: url("${unsafeCSS(PILL_MASK_IMAGE)}");
      }

      .container[data-shape="${unsafeCSS(WeatherCardShape.SCALLOP)}"] {
        --mask: url("${unsafeCSS(SCALLOP_MASK_IMAGE)}");
      }

      .container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-position: center;
        mask-position: center;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-image: var(--mask);
        mask-image: var(--mask);
        border-radius: var(--border-radius, 0);
        transition:
          background-color 180ms ease-in-out,
          width 180ms ease-in-out,
          height 180ms ease-in-out,
          top 180ms ease-in-out,
          left 180ms ease-in-out;
      }

      .container:has(.background:focus-visible)::before {
        background: var(--primary-color);
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
      }

      .container * {
        pointer-events: none;
      }

      .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
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
        -webkit-mask-image: var(--mask);
        mask-image: var(--mask);
        border-radius: var(--border-radius, 0);
        cursor: pointer;
        pointer-events: all;
        border: none;
      }

      .content {
        max-height: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        display: grid;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;
        grid-template-areas:
          ". label"
          "icon .";
      }

      .icon-container {
        grid-area: icon;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
      }

      .icon-container bc-icon {
        max-height: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        transform: translate(25%, -25%);
        scale: 1.1;
      }

      .label-container {
        grid-area: label;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .label-container svg {
        max-height: 100%;
        max-width: 100%;
        aspect-ratio: 1 / 1;
        transform: translate(-25%, 25%);
        scale: 1.1;
      }

      .label-container svg text {
        font-size: 9rem;
        font-weight: 700;
        fill: var(--primary-text-color);
      }
    `;
  }
}

BoldWeatherCard.registerCustomCard({
  name: "Bold Weather Card",
  description: "A weather card.",
  preview: true,
});
