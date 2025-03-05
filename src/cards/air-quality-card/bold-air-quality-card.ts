import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { AirQualityCardConfig } from "./types";
import { LovelaceGridOptions } from "../../types/ha/lovelace";
import { BoldCardWithEntity } from "../base";
import { HassEntity } from "home-assistant-js-websocket";
import { t } from "../../localization/i18n";
import { mdiWaves } from "@mdi/js";
import { styleMap } from "lit-html/directives/style-map";

@customElement("bold-air-quality-card")
export class BoldAirQualityCard extends BoldCardWithEntity<
  AirQualityCardConfig,
  HassEntity
> {
  public static getStubConfig(): AirQualityCardConfig {
    return {
      type: "custom:bold-air-quality-card",
      entity: "",
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
    if (!this._config || !this.hass) {
      return nothing;
    }

    return html`
      <ha-card
        style=${styleMap({
          // "--ha-card-background":
          //   "color-mix(in srgb, oklch(0.723 0.219 149.579), var(--card-background-color) 99%)",
          // color:
          //   "color-mix(in srgb, var(--primary-text-color), oklch(0.723 0.219 149.579) 5%)",
        })}
      >
        <div class="header">
          <ha-svg-icon .path=${mdiWaves}></ha-svg-icon>
          <div class="name">${t("card.air_quality.label.air_quality")}</div>
        </div>
        <div class="content">
          <span class="value">${this._stateObj?.state}</span>
          <span class="unit"
            >${this._stateObj?.attributes.unit_of_measurement}</span
          >
        </div>
        <div class="graph-container">
          <div class="graph">
            <div
              class="bar"
              style=${styleMap({
                backgroundColor: "oklch(0.723 0.219 149.579)",
              })}
            ></div>
            <div
              class="bar"
              style=${styleMap({
                backgroundColor: "oklch(0.905 0.182 98.111)",
              })}
            ></div>
            <div
              class="bar"
              style=${styleMap({
                backgroundColor: "oklch(0.553 0.195 38.402)",
              })}
            ></div>
            <div
              class="bar"
              style=${styleMap({
                backgroundColor: "oklch(0.455 0.188 13.697)",
              })}
            ></div>
            <div
              class="bar"
              style=${styleMap({
                backgroundColor: "oklch(0.401 0.17 325.612)",
              })}
            ></div>
          </div>
          <div
            class="indicator"
            style=${styleMap({ backgroundColor: "oklch(0.723 0.219 149.579)" })}
          ></div>
        </div>
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      --mdc-icon-size: 14px;
      font-size: 0.8em;
      font-weight: 500;
    }

    .content {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-top: auto;
      margin-bottom: 16px;
    }

    .value {
      font-size: 2.7em;
      font-weight: 400;
    }

    .unit {
      font-size: 1em;
      font-weight: 500;
      opacity: 0.8;
    }

    .graph-container {
      position: relative;
    }

    .graph {
      position: inherit;
      display: flex;
      flex-direction: row;
      border-radius: 8px;
      overflow: hidden;
    }

    .graph .bar {
      flex: 1;
      height: 4px;
    }

    .graph-container .indicator {
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      border: 2px solid var(--ha-card-background);
      top: 50%;
      left: 12%;
      transform: translate(-50%, -50%);
    }
  `;
}

BoldAirQualityCard.registerCustomCard({
  type: "bold-air-quality-card",
  name: "Bold Air Quality Card",
  description: "A custom card for displaying air quality information.",
  preview: true,
});
