import { FeatureInternals } from "../../types/ha/feature";
import { DefaultConfigType } from "../types";

export function getDefaultConfigTypeFromFeatureInternals(
  internals?: FeatureInternals,
) {
  if (!internals) {
    return DefaultConfigType.EXTERNAL;
  }
  return internals.is_inlined
    ? DefaultConfigType.INLINED
    : DefaultConfigType.DEFAULT;
}
