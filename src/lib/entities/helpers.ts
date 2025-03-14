import { HomeAssistant } from "../../types/ha/lovelace";

export function getStateObj(entityId?: string, hass?: HomeAssistant) {
  if (!entityId) {
    return undefined;
  }
  return hass?.states[entityId];
}

export function getEntityByEntityId(entityId?: string, hass?: HomeAssistant) {
  if (!entityId) {
    return undefined;
  }
  return hass?.entities[entityId];
}

export function getDeviceByEntityId(entityId?: string, hass?: HomeAssistant) {
  const entity = getEntityByEntityId(entityId, hass);
  if (!entity || !entity.device_id) {
    return undefined;
  }
  return hass?.devices[entity.device_id];
}
