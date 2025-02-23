import { HassEntity } from "home-assistant-js-websocket";

export function supportsFeature(stateObj: HassEntity, feature: number) {
  return (stateObj.attributes.supported_features! & feature) !== 0;
}
