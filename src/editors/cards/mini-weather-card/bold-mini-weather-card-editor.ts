import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import { customElement } from "lit/decorators";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithEntity } from "../base";
import {
  MiniWeatherCardArrangement,
  MiniWeatherCardConfig,
  MiniWeatherCardShape,
} from "../../../cards/mini-weather-card/types";
import { WeatherEntity } from "../../../lib/weather/types";
import { miniWeatherCardConfigStruct } from "../../../cards/mini-weather-card/struct";
import { enumToOptions } from "../../helpers";

@customElement("bold-mini-weather-card-editor")
export class BoldMiniWeatherCardEditor extends BoldLovelaceCardEditorWithEntity<
  MiniWeatherCardConfig,
  WeatherEntity
> {
  protected get _struct() {
    return miniWeatherCardConfigStruct;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    const schema = [
      {
        name: "entity",
        selector: { entity: { domain: "weather" } },
      },
      {
        name: "temperature_entity",
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "shape",
        selector: {
          select: {
            mode: "box",
            options: enumToOptions(MiniWeatherCardShape, {
              labelScope: "common.mini_weather_card_shape",
            }),
          },
        },
      },
      {
        name: "arrangement",
        selector: {
          select: {
            mode: "box",
            options: enumToOptions(MiniWeatherCardArrangement, {
              labelScope: "common.mini_weather_card_arrangement",
            }),
          },
        },
      },
    ];

    const stateObj = this._stateObj;
    const attribution = stateObj?.attributes.attribution;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${this._computeLabelCallback}
        .computeHelper=${this._computeHelperCallback}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="attribution">${attribution}</p>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    fireEvent(this, "config-changed", {
      config: ev.detail.value as MiniWeatherCardConfig,
    });
  }

  private _computeLabelCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.weather.label",
    });
  };

  private _computeHelperCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.card.weather.helper_text",
      defaultValue: "",
    });
  };

  static styles: CSSResultGroup = [
    editorBaseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .attribution {
        margin-top: 16px;
        font-size: 0.8em;
        color: var(--secondary-text-color);
      }
    `,
  ];
}
