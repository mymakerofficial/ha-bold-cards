import { MediaPlayerEntity } from "../../types/ha/entity";
import { HomeAssistant } from "../../types/ha/lovelace";

export function getMediaPlayerChildEntity(
  parent: MediaPlayerEntity,
  hass?: HomeAssistant,
): MediaPlayerEntity | undefined {
  if (parent.attributes.active_child) {
    return hass?.states[parent.attributes.active_child] as
      | MediaPlayerEntity
      | undefined;
  }
  return undefined;
}

export function getMediaPlayerChildEntityRecursively(
  parent: MediaPlayerEntity,
  predicate: (entity: MediaPlayerEntity) => boolean = () => true,
  hass?: HomeAssistant,
): MediaPlayerEntity {
  let entity = getMediaPlayerChildEntity(parent, hass);
  if (!entity || !predicate(entity)) {
    return parent;
  }
  return getMediaPlayerChildEntityRecursively(entity, predicate, hass);
}
