import { isEmpty, isUndefined, toPromise } from "../../../lib/helpers";
import {
  getCardStubConfig,
  getLovelaceCardElementClass,
} from "../../../lib/cards/helpers";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { Optional } from "../../../lib/types";

export async function getEntitiesForCard(
  hass: HomeAssistant,
  type: string,
  entities: string[],
  count: number,
) {
  const pickedEntities: string[] = [];

  while (count > pickedEntities.length) {
    const availableEntities = entities.filter(
      (entity) => !pickedEntities.includes(entity),
    );

    const entity = await getNextEntityForCard(hass, type, availableEntities);

    if (isUndefined(entity) || isEmpty(entity)) {
      // no entity was provided so we can stop
      break;
    }

    pickedEntities.push(entity);
  }

  return pickedEntities;
}

async function getNextEntityForCard(
  hass: HomeAssistant,
  type: string,
  availableEntities: string[],
) {
  const stub = await getCardStubConfig(hass, type, availableEntities);
  return stub.entity as Optional<string>;
}
