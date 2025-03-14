import { HomeAssistant } from "../../types/ha/lovelace";
import { getStateObj } from "../entities/helpers";
import { isMediaPlayerEntity } from "../../helpers/states";

export function dedupeMediaPlayerEntities(
  entityIds: string[],
  hass?: HomeAssistant,
) {
  if (!hass) {
    return entityIds;
  }

  const entities = entityIds
    .map((entityId) => getStateObj(entityId, hass))
    .filter((entity) => !!entity);

  const seen = new Set();

  return entities
    .filter((entity) => {
      if (!isMediaPlayerEntity(entity)) {
        return true;
      }

      const combinedState = [
        entity.state,
        entity.attributes.media_content_id,
        entity.attributes.media_title,
        entity.attributes.media_artist,
      ].join();

      if (seen.has(combinedState)) {
        return false;
      }
      seen.add(combinedState);
      return true;
    })
    .map((entity) => entity.entity_id);
}
