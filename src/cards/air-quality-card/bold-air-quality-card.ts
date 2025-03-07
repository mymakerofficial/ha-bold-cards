import { unsafeCSS, css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import { AirQualityCardConfig } from "./types";
import { LovelaceGridOptions } from "../../types/ha/lovelace";
import { BoldCardWithEntity } from "../base";
import { HassEntity } from "home-assistant-js-websocket";
import { t } from "../../localization/i18n";
import { mdiWaves } from "@mdi/js";
import { styleMap } from "lit-html/directives/style-map";
import { repeat } from "lit-html/directives/repeat";

function pm25toAQI(pm25: number): number {
  // TODO Implement AQI calculation
  // copilot wrote this so its probably wrong
  if (pm25 >= 0 && pm25 <= 12) {
    return Math.round((50 / 12) * pm25);
  } else if (pm25 >= 12.1 && pm25 <= 35.4) {
    return Math.round((49 / 23.4) * (pm25 - 12.1) + 51);
  } else if (pm25 >= 35.5 && pm25 <= 55.4) {
    return Math.round((49 / 19.9) * (pm25 - 35.5) + 101);
  } else if (pm25 >= 55.5 && pm25 <= 150.4) {
    return Math.round((49 / 94.9) * (pm25 - 55.5) + 151);
  } else if (pm25 >= 150.5 && pm25 <= 250.4) {
    return Math.round((49 / 99.9) * (pm25 - 150.5) + 201);
  } else if (pm25 >= 250.5 && pm25 <= 350.4) {
    return Math.round((49 / 99.9) * (pm25 - 250.5) + 301);
  } else if (pm25 >= 350.5 && pm25 <= 500.4) {
    return Math.round((49 / 149.9) * (pm25 - 350.5) + 401);
  } else {
    return 500;
  }
}

function scaleAQIToEqualIntervals(aqi: number): number {
  if (aqi >= 0 && aqi <= 50) {
    return ((aqi / 50) * 100) / 6;
  } else if (aqi >= 51 && aqi <= 100) {
    return (((aqi - 50) / 50) * 100) / 6 + 100 / 6;
  } else if (aqi >= 101 && aqi <= 150) {
    return (((aqi - 100) / 50) * 100) / 6 + 200 / 6;
  } else if (aqi >= 151 && aqi <= 200) {
    return (((aqi - 150) / 50) * 100) / 6 + 300 / 6;
  } else if (aqi >= 201 && aqi <= 300) {
    return (((aqi - 200) / 100) * 100) / 6 + 400 / 6;
  } else {
    return (((aqi - 300) / 200) * 100) / 6 + 500 / 6;
  }
}

const AQILevel = {
  GOOD: "good",
  MODERATE: "moderate",
  UNHEALTHY_SENSITIVE: "unhealthy_sensitive",
  UNHEALTHY: "unhealthy",
  VERY_UNHEALTHY: "very_unhealthy",
  HAZARDOUS: "hazardous",
} as const;
type AQILevel = (typeof AQILevel)[keyof typeof AQILevel];

const Colors = {
  GREEN: "oklch(0.723 0.219 149.579)",
  YELLOW: "oklch(0.879 0.169 91.605)",
  ORANGE: "oklch(0.553 0.195 38.402)",
  RED: "oklch(0.455 0.188 13.697)",
  PURPLE: "oklch(0.401 0.17 325.612)",
  MAROON: "oklch(0.271 0.105 12.094)",
} as const;

const AQIColors = {
  [AQILevel.GOOD]: Colors.GREEN,
  [AQILevel.MODERATE]: Colors.YELLOW,
  [AQILevel.UNHEALTHY_SENSITIVE]: Colors.ORANGE,
  [AQILevel.UNHEALTHY]: Colors.RED,
  [AQILevel.VERY_UNHEALTHY]: Colors.PURPLE,
  [AQILevel.HAZARDOUS]: Colors.MAROON,
};

function getAQILevel(aqi: number): AQILevel {
  if (aqi >= 0 && aqi <= 50) {
    return AQILevel.GOOD;
  } else if (aqi >= 51 && aqi <= 100) {
    return AQILevel.MODERATE;
  } else if (aqi >= 101 && aqi <= 150) {
    return AQILevel.UNHEALTHY_SENSITIVE;
  } else if (aqi >= 151 && aqi <= 200) {
    return AQILevel.UNHEALTHY;
  } else if (aqi >= 201 && aqi <= 300) {
    return AQILevel.VERY_UNHEALTHY;
  } else {
    return AQILevel.HAZARDOUS;
  }
}

function getAQIColor(level: AQILevel): string {
  return AQIColors[level];
}

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

    const aqi = pm25toAQI(Number(this._stateObj?.state));
    const percent = scaleAQIToEqualIntervals(aqi);
    const currentLevel = getAQILevel(aqi);
    const color = getAQIColor(currentLevel);

    return html`
      <ha-card
        style=${styleMap({
          "--ha-card-background": `color-mix(in srgb, ${color}, var(--card-background-color) 98%)`,
          "--text-color": `color-mix(in srgb, var(--primary-text-color), ${color} 30%)`,
          color: "var(--text-color)",
        })}
      >
        <div class="header">
          <ha-svg-icon .path=${mdiWaves}></ha-svg-icon>
          <div class="name">${t("card.air_quality.label.air_quality")}</div>
        </div>
        <div class="content">
          <span class="value">${aqi}</span>
        </div>
        <div class="graph-container">
          <div class="graph">
            ${repeat(
              Object.values(AQILevel),
              (level) => html`
                <div
                  class="bar"
                  data-level=${level}
                  data-active=${level === currentLevel}
                ></div>
              `,
            )}
          </div>
          <div
            class="indicator"
            data-level=${currentLevel}
            style=${styleMap({
              left: `${percent}%`,
            })}
          ></div>
        </div>
      </ha-card>
    `;
  }

  static styles = [
    css`
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
        justify-content: end;
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
        border-radius: 2px;
        margin: 0 -1px;
        background-color: color-mix(
          in srgb,
          var(--ha-card-background),
          var(--text-color) 30%
        );
      }

      .graph .bar[data-active="true"] {
        margin: 0 4px;
      }

      .graph .bar:first-child {
        margin-left: 0;
      }

      .graph .bar:last-child {
        margin-right: 0;
      }

      .graph-container .indicator {
        position: absolute;
        height: 12px;
        width: 4px;
        border-radius: 8px;
        border: 3px solid var(--ha-card-background);
        top: 50%;
        left: 0%;
        transform: translate(-50%, -50%);
      }
    `,
    ...Object.values(AQILevel).map((level) => {
      const levelCss = unsafeCSS(level);
      const colorCss = unsafeCSS(getAQIColor(level));

      return css`
        .indicator[data-level="${levelCss}"] {
          background-color: ${colorCss};
        }

        .bar[data-level="${levelCss}"][data-active="true"] {
          background-color: ${colorCss};
        }
      `;
    }),
  ];
}

BoldAirQualityCard.registerCustomCard({
  type: "bold-air-quality-card",
  name: "Bold Air Quality Card",
  description: "A custom card for displaying air quality information.",
  preview: true,
});
