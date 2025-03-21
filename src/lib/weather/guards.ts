import { HassEntity } from "home-assistant-js-websocket";
import { WeatherEntity } from "./types";
import { computeDomain } from "../../helpers/entity";

export function isWeatherEntity(
  stateObj: HassEntity,
): stateObj is WeatherEntity {
  return computeDomain(stateObj.entity_id) === "weather";
}
