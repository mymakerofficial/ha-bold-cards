import { HomeAssistant } from "../../types/ha/lovelace";
import { isWeatherEntity } from "./guards";
import { isStateActive } from "../../helpers/states";
import { randomFrom } from "../helpers";

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
