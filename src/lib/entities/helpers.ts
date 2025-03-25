import { HomeAssistant } from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";

export function getStateObj<T extends HassEntity = HassEntity>(
  entityId?: string,
  hass?: HomeAssistant,
) {
  if (!entityId) {
    return undefined;
  }
  return hass?.states[entityId] as T;
}

export function getEntityByEntityId(entityId?: string, hass?: HomeAssistant) {
  if (!entityId) {
    return undefined;
  }
  return hass?.entities[entityId];
}

export function getDeviceByDeviceId(deviceId?: string, hass?: HomeAssistant) {
  if (!deviceId) {
    return undefined;
  }
  return hass?.devices[deviceId];
}

export function getDeviceByEntityId(entityId?: string, hass?: HomeAssistant) {
  const entity = getEntityByEntityId(entityId, hass);
  if (!entity || !entity.device_id) {
    return undefined;
  }
  return getDeviceByDeviceId(entity.device_id, hass);
}
