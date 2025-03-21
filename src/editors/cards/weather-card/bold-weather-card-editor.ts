import { css, CSSResultGroup, html, nothing } from "lit";
import { fireEvent } from "custom-card-helpers";
import { customElement } from "lit/decorators";
import { t } from "../../../localization/i18n";
import { editorBaseStyles } from "../../styles";
import { BoldLovelaceCardEditorWithEntity } from "../base";
import { WeatherCardConfig } from "../../../cards/weather-card/types";
import { WeatherEntity } from "../../../lib/weather/types";
import { weatherCardConfigStruct } from "../../../cards/weather-card/struct";

@customElement("bold-weather-card-editor")
export class BoldWeatherCardEditor extends BoldLovelaceCardEditorWithEntity<
  WeatherCardConfig,
  WeatherEntity
> {
  protected get _struct() {
    return weatherCardConfigStruct;
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
      config: ev.detail.value as WeatherCardConfig,
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
