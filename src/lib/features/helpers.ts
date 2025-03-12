import { DefaultConfigType } from "../types";
import { FeatureInternals } from "../internals/types";

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
