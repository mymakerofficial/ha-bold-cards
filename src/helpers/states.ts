import { BaseState, MediaPlayerState } from "../types/ha/entity";
import { HassEntity } from "home-assistant-js-websocket";
import { computeDomain } from "./entity";

export function isStateOff(state: string) {
  return (
    [BaseState.OFF, BaseState.UNAVAILABLE, BaseState.UNKNOWN] as string[]
  ).includes(state);
}

export function isStateUnavailable(state: string) {
  return ([BaseState.UNAVAILABLE, BaseState.UNKNOWN] as string[]).includes(
    state,
  );
}

export function isStateActive(stateObj: HassEntity) {
  const domain = computeDomain(stateObj.entity_id);

  if (isStateOff(stateObj.state)) {
    return false;
  }

  switch (domain) {
    case "media_player":
      return stateObj.state !== MediaPlayerState.STANDBY;
    default:
      return false;
  }
}
