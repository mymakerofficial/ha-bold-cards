import { object } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { BoldFeatureStackFeature } from "./bold-feature-stack-feature";
import { featuresStruct } from "../../lib/features/structs";

export const featureStackFeatureStruct = object({
  type: exactMatch(BoldFeatureStackFeature.getStubConfig().type),
  features: featuresStruct,
});
