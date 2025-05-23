import { z } from "zod/v4";
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

function _getMediaPlayerChildEntityRecursively(
  parent: MediaPlayerEntity,
  predicate: (entity: MediaPlayerEntity, depth: number) => boolean = () => true,
  depth = 0,
  hass?: HomeAssistant,
): MediaPlayerEntity {
  const entity = getMediaPlayerChildEntity(parent, hass);
  if (!entity || !predicate(entity, depth)) {
    return parent;
  }
  return _getMediaPlayerChildEntityRecursively(
    entity,
    predicate,
    depth + 1,
    hass,
  );
}

export function getMediaPlayerChildEntityRecursively(
  parent: MediaPlayerEntity,
  predicate: (entity: MediaPlayerEntity, depth: number) => boolean = () => true,
  hass?: HomeAssistant,
): MediaPlayerEntity {
  return _getMediaPlayerChildEntityRecursively(parent, predicate, 0, hass);
}

export interface UniversalMediaPlayerEnhancements {
  enabled?: boolean;
  exclude_entities?: string[];
  exclude_deep_entities?: string[];
}

export const universalMediaPlayerEnhancementsStruct = z.object({
  enabled: z.boolean().optional(),
  exclude_entities: z.string().array().optional(),
  exclude_deep_entities: z.string().array().optional(),
});

export function getUniversalMediaPlayerChildStateObj(
  stateObj?: MediaPlayerEntity,
  universalMediaPlayerChildEnhancements?: UniversalMediaPlayerEnhancements,
  hass?: HomeAssistant,
) {
  if (!stateObj) {
    return undefined;
  }

  if (
    !universalMediaPlayerChildEnhancements ||
    !universalMediaPlayerChildEnhancements.enabled
  ) {
    return stateObj;
  }

  return getMediaPlayerChildEntityRecursively(
    stateObj,
    (entity, depth) => {
      if (depth === 0) {
        return !universalMediaPlayerChildEnhancements.exclude_entities?.includes(
          entity.entity_id,
        );
      }
      return !universalMediaPlayerChildEnhancements.exclude_deep_entities?.includes(
        entity.entity_id,
      );
    },
    hass,
  );
}
