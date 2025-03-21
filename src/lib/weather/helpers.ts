import { HomeAssistant } from "../../types/ha/lovelace";
import { isWeatherEntity } from "./guards";
import { isStateActive } from "../../helpers/states";
import { randomFrom } from "../helpers";
import { BoldIcon } from "../icons/icons";
import { WeatherState } from "./types";

export function getStubWeatherEntity(hass?: HomeAssistant) {
  if (!hass) {
    return undefined;
  }

  const entities = Object.values(hass.states).filter(isWeatherEntity);

  if (entities.length === 0) {
    return undefined;
  }

  const activeEntities = entities.filter(isStateActive);

  return activeEntities.length > 0
    ? randomFrom(activeEntities)
    : randomFrom(entities);
}

const weatherIcons: Partial<{ [key in WeatherState]: BoldIcon | undefined }> = {
  [WeatherState.CLEAR_NIGHT]: "bold:moon",
  [WeatherState.CLOUDY]: "bold:cloudy",
  [WeatherState.FOG]: "bold:cloudy",
  [WeatherState.HAIL]: undefined,
  [WeatherState.LIGHTNING]: undefined,
  [WeatherState.LIGHTNING_RAINY]: undefined,
  [WeatherState.PARTLYCLOUDY]: "bold:partly-cloudy",
  [WeatherState.POURING]: undefined,
  [WeatherState.RAINY]: undefined,
  [WeatherState.SNOWY]: undefined,
  [WeatherState.SNOWY_RAINY]: undefined,
  [WeatherState.SUNNY]: "bold:sun",
  [WeatherState.WINDY]: undefined,
  [WeatherState.WINDY_VARIANT]: undefined,
  [WeatherState.EXCEPTIONAL]: "bold:sun",
};

export function getWeatherIcon(state: WeatherState) {
  return weatherIcons[state] ?? "mdi:help-circle";
}
