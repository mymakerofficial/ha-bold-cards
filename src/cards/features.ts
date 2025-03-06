import { FeatureInternals } from "../types/ha/feature";
import {
  CustomCardInternalsEntry,
  GetFeatureInternalsContext,
} from "../types/card";

function getFallbackFeatureInternals(
  context: GetFeatureInternalsContext,
): FeatureInternals {
  return {
    parent_card_type: context.config?.type ?? "",
    is_inlined: false,
  };
}

export function getCardFeatureInternals(
  context: GetFeatureInternalsContext,
): FeatureInternals {
  if (!context.config?.type) {
    return getFallbackFeatureInternals(context);
  }
  (window as any).__customCardFeaturesSizeMap =
    (window as any).__customCardFeaturesSizeMap || new Map();
  const entry = (window as any).__customCardInternalsMap.get(
    context.config.type,
  ) as CustomCardInternalsEntry | undefined;
  if (!entry?.getFeatureInternals) {
    return getFallbackFeatureInternals(context);
  }
  return entry.getFeatureInternals(context);
}
