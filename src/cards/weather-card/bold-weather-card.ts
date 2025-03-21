import {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { BoldCardType } from "../../lib/cards/types";
import { customElement } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldCardWithEntity } from "../base";
import { WeatherCardConfig } from "./types";
import { css, html, nothing, unsafeCSS } from "lit";
import { WeatherEntity } from "../../lib/weather/types";
import {
  getStubWeatherEntity,
  getWeatherIcon,
} from "../../lib/weather/helpers";
import { HassEntity } from "home-assistant-js-websocket";
import { actionHandler } from "../../helpers/ha/action-handler-directive";
import {
  ActionHandlerEvent,
  fireEvent,
  handleAction,
  hasAction,
} from "custom-card-helpers";

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
    const icon = getWeatherIcon(stateObj.state);

    return html`<div class="content">
      <button
        class="background"
        role="button"
        tabindex="0"
        @click=${this._handleMoreInfo}
      >
        <ha-ripple></ha-ripple>
      </button>
      <bc-icon class="icon" icon=${icon}></bc-icon>
      <div class="label">${temperature}˚</div>
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

      .content {
        height: 100%;
        aspect-ratio: 1 / 1;
        position: relative;
      }

      .content::before {
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
        -webkit-mask-image: url("${unsafeCSS(MASK_IMAGE)}");
        mask-image: url("${unsafeCSS(MASK_IMAGE)}");
        transition:
          background-color 180ms ease-in-out,
          width 180ms ease-in-out,
          height 180ms ease-in-out,
          top 180ms ease-in-out,
          left 180ms ease-in-out;
      }

      .content:has(.background:focus-visible)::before {
        background: var(--primary-color);
        top: -2px;
        left: -2px;
        width: calc(100% + 4px);
        height: calc(100% + 4px);
      }

      .content * {
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
        -webkit-mask-image: url("${unsafeCSS(MASK_IMAGE)}");
        mask-image: url("${unsafeCSS(MASK_IMAGE)}");
        cursor: pointer;
        pointer-events: all;
        border: none;
      }

      .icon {
        position: absolute;
        bottom: 35%;
        left: 40%;
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
