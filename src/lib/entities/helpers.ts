import { HomeAssistant } from "../../types/ha/lovelace";

export function getEntityEntryFromEntityId(
  entityId?: string,
  hass?: HomeAssistant,
) {
  if (!entityId) {
    return undefined;
  }
  return hass?.entities[entityId];
}

export function getDeviceEntryFromEntityId(
  entityId?: string,
  hass?: HomeAssistant,
) {
  const entity = getEntityEntryFromEntityId(entityId, hass);
  if (!entity || !entity.device_id) {
    return undefined;
  }
  return hass?.devices[entity.device_id];
}
