import { BcGlanceItemBase } from "./base";
import {
  GlanceItemConfig,
  WeatherGlanceItemConfig,
} from "../../../lib/at-a-glance/types";
import { nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { getWeatherIcon } from "../../../lib/weather/helpers";
import { WeatherEntity } from "../../../lib/weather/types";

@customElement("bc-weather-glance-item")
export class BcWeatherGlanceItem extends BcGlanceItemBase<WeatherGlanceItemConfig> {
  protected getItem(config: GlanceItemConfig) {
    return config as WeatherGlanceItemConfig;
  }

  render() {
    if (!this._item) {
      return nothing;
    }

    const stateObj = this.getStateObj<WeatherEntity>(this._item.entity);

    if (!stateObj) {
      return nothing;
    }

    const time = new Date(stateObj.last_changed).getHours();
    const isNight = time < 6 || time > 18;
    const icon = getWeatherIcon(stateObj.state, isNight);

    const content = `${Math.round(Number(stateObj.attributes.temperature ?? 0))}°`;

    return this._baseTemplate({
      content,
      icon,
    });
  }
}
