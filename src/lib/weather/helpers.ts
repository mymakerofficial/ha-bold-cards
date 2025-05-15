import { HomeAssistant } from "../../types/ha/lovelace";
import { isWeatherEntity } from "./guards";
import { isStateActive } from "../../helpers/states";
import { randomFrom } from "../helpers";
import { BoldIcon } from "../icons/icons";
import { WeatherState } from "./types";
import { Maybe } from "../types";

export function getStubWeatherEntity(
  hass: Maybe<HomeAssistant>,
  entities: string[],
  _entitiesFallback: string[],
) {
  if (!hass) {
    return undefined;
  }

  const weatherEntities = Object.values(hass.states)
    .filter((it) => entities.includes(it.entity_id))
    .filter(isWeatherEntity);

  if (weatherEntities.length === 0) {
    return undefined;
  }

  const activeEntities = weatherEntities.filter(isStateActive);

  return activeEntities.length > 0
    ? randomFrom(activeEntities)
    : randomFrom(weatherEntities);
}

const dayWeatherIcons: Partial<{
  [key in WeatherState]: BoldIcon | undefined;
}> = {
  [WeatherState.CLEAR_NIGHT]: "bold:weather-clear-night",
  [WeatherState.CLOUDY]: "bold:weather-mostly-cloudy-day",
  [WeatherState.FOG]: "bold:weather-cloudy",
  [WeatherState.HAIL]: undefined,
  [WeatherState.LIGHTNING]: undefined,
  [WeatherState.LIGHTNING_RAINY]: undefined,
  [WeatherState.PARTLYCLOUDY]: "bold:weather-partly-cloudy-day",
  [WeatherState.POURING]: undefined,
  [WeatherState.RAINY]: undefined,
  [WeatherState.SNOWY]: undefined,
  [WeatherState.SNOWY_RAINY]: undefined,
  [WeatherState.SUNNY]: "bold:weather-clear-day",
  [WeatherState.WINDY]: undefined,
  [WeatherState.WINDY_VARIANT]: undefined,
  [WeatherState.EXCEPTIONAL]: "bold:weather-clear-day",
};

const nightWeatherIcons: Partial<{
  [key in WeatherState]: BoldIcon | undefined;
}> = {
  [WeatherState.CLEAR_NIGHT]: "bold:weather-clear-night",
  [WeatherState.CLOUDY]: "bold:weather-mostly-cloudy-night",
  [WeatherState.FOG]: "bold:weather-cloudy",
  [WeatherState.HAIL]: undefined,
  [WeatherState.LIGHTNING]: undefined,
  [WeatherState.LIGHTNING_RAINY]: undefined,
  [WeatherState.PARTLYCLOUDY]: "bold:weather-partly-cloudy-night",
  [WeatherState.POURING]: undefined,
  [WeatherState.RAINY]: undefined,
  [WeatherState.SNOWY]: undefined,
  [WeatherState.SNOWY_RAINY]: undefined,
  [WeatherState.SUNNY]: "bold:weather-clear-day",
  [WeatherState.WINDY]: undefined,
  [WeatherState.WINDY_VARIANT]: undefined,
  [WeatherState.EXCEPTIONAL]: "bold:weather-starry-night",
};

export function getWeatherIcon(state: WeatherState, isNight = false) {
  return isNight ? nightWeatherIcons[state] : dayWeatherIcons[state];
}
