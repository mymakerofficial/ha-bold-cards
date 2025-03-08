import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators";
import {
  LovelaceCardConfig,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { BoldLovelaceCard } from "../base";
import { repeat } from "lit-html/directives/repeat";
import { styleMap } from "lit-html/directives/style-map";
import { EntityState } from "../../types/ha/entity";

@customElement("bold-battery-card")
export class BoldBatteryCard extends BoldLovelaceCard<LovelaceCardConfig> {
  public static getStubConfig(): LovelaceCardConfig {
    return {
      type: "custom:bold-battery-card",
      grid_options: {
        rows: 4,
      },
    };
  }

  public getCardSize() {
    return Number(this._config?.grid_options?.rows) || 4;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      rows: this.getCardSize(),
      min_columns: 6,
      min_rows: 1,
    };
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const limit = Math.max(Math.ceil((this.getCardSize() - 1) * 0.9), 1);

    const batteryEntities = Object.values(this.hass.states)
      .filter(
        (entity) =>
          entity.entity_id.startsWith("sensor.") &&
          entity.attributes.device_class === "battery",
      )
      // filter out unavailable entities
      .filter((stateObj) => stateObj.state !== EntityState.UNAVAILABLE)
      .map((stateObj) => {
        const entity = this.hass!.entities[stateObj.entity_id];
        if (!entity || !entity.device_id) return stateObj;
        const device = this.hass!.devices[entity.device_id];
        if (!device) return stateObj;
        return {
          ...stateObj,
          attributes: {
            ...stateObj.attributes,
            friendly_name: device.name,
          },
        };
      })
      // compare battery entities by state
      .sort((a, b) => parseInt(a.state) - parseInt(b.state))
      // limit entities
      .slice(0, limit);

    return html`
      <ha-card>
        ${repeat(
          batteryEntities,
          (stateObj) => stateObj.entity_id,
          (stateObj) => html`
            <div
              class="bar-wrapper"
              data-state=${Number(stateObj.state) > 100
                ? "high"
                : Number(stateObj.state) < 25 && "low"}
            >
              <div
                class="bar"
                style=${styleMap({ width: `${stateObj.state}%` })}
              ></div>
              <div class="bar-label">
                <div>${stateObj.attributes.friendly_name}</div>
              </div>
              <div class="bar-value">
                <div>${stateObj.state}%</div>
                <ha-state-icon
                  .stateObj=${stateObj}
                  .hass=${this.hass}
                ></ha-state-icon>
              </div>
            </div>
          `,
        )}
      </ha-card>
    `;
  }

  static styles = css`
    ha-card {
      --tile-color: var(--primary-color);
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
    }

    * {
      color: color-mix(
        in srgb,
        var(--primary-text-color),
        var(--tile-color) 30%
      );
      font-weight: 500;
    }

    .bar-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      background-color: rgb(from var(--tile-color) r g b / 10%);
      border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
    }

    .bar-wrapper[data-state="low"] {
      --tile-color: var(--error-color);
    }

    .bar {
      height: 100%;
      position: absolute;
      background-color: rgb(from var(--tile-color) r g b / 20%);
      border-radius: 0 99999px 99999px 0;
    }

    .bar-wrapper[data-state="high"] .bar {
      border-radius: calc(var(--ha-card-border-radius, 12px) / 2);
    }

    .bar-label,
    .bar-value {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 16px;
    }
  `;
}

BoldBatteryCard.registerCustomCard({
  type: "bold-battery-card",
  name: "Bold Battery Card",
  description:
    "A custom card for displaying all battery entities in one place.",
  preview: true,
});
