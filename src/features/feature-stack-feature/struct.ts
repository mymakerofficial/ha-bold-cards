import { object } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { featuresStruct } from "../../lib/features/structs";
import { BoldFeatureType } from "../../lib/features/types";

export const featureStackFeatureStruct = object({
  type: exactMatch(BoldFeatureType.FEATURE_STACK),
  features: featuresStruct,
});
