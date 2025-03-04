import {
  CustomCardFeatureSizeEntry,
  FeatureConfigWithMaybeInternals,
} from "../types/ha/feature";
import { HassEntity } from "home-assistant-js-websocket";

export function getFeatureSize(
  config: FeatureConfigWithMaybeInternals,
  stateObj: HassEntity,
): number {
  (window as any).__customCardFeaturesSizeMap =
    (window as any).__customCardFeaturesSizeMap || new Map();
  const sizeFns = (window as any).__customCardFeaturesSizeMap.get(
    config.type,
  ) as CustomCardFeatureSizeEntry | undefined;
  if (!sizeFns?.getSize) {
    return 1;
  }
  return sizeFns.getSize(config, stateObj);
}

export function getFeatureDoesRender(
  config: FeatureConfigWithMaybeInternals,
  stateObj: HassEntity,
): boolean {
  (window as any).__customCardFeaturesSizeMap =
    (window as any).__customCardFeaturesSizeMap || new Map();
  const sizeFns = (window as any).__customCardFeaturesSizeMap.get(
    config.type,
  ) as CustomCardFeatureSizeEntry | undefined;
  if (!sizeFns?.doesRender) {
    return getFeatureSize(config, stateObj) > 0;
  }
  return sizeFns.doesRender(config, stateObj);
}
