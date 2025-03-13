import {
  EntityState,
  MediaPlayerEntity,
  MediaPlayerState,
} from "../types/ha/entity";
import { HassEntity } from "home-assistant-js-websocket";
import { computeDomain } from "./entity";

export function isStateOff(state: string) {
  return (
    [EntityState.OFF, EntityState.UNAVAILABLE, EntityState.UNKNOWN] as string[]
  ).includes(state);
}

export function isStateUnavailable(state: string) {
  return ([EntityState.UNAVAILABLE, EntityState.UNKNOWN] as string[]).includes(
    state,
  );
}

export function isMediaPlayerStateActive(state: string) {
  return (
    !isStateOff(state) &&
    !([MediaPlayerState.IDLE, MediaPlayerState.STANDBY] as string[]).includes(
      state,
    )
  );
}

export function isStateActive(stateObj?: HassEntity) {
  if (!stateObj) {
    return false;
  }

  const domain = computeDomain(stateObj.entity_id);

  if (isStateOff(stateObj.state)) {
    return false;
  }

  switch (domain) {
    case "media_player":
      return isMediaPlayerStateActive(stateObj.state);
    default:
      return true;
  }
}

export function isMediaPlayerEntity(
  stateObj: HassEntity,
): stateObj is MediaPlayerEntity {
  return computeDomain(stateObj.entity_id) === "media_player";
}
