import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";
import { BoldFeatureTypes } from "../../lib/features/types";

export interface BoldFeatureStackFeatureConfig {
  type: BoldFeatureTypes["FEATURE_STACK"];
  features?: FeatureConfigWithMaybeInternals[];
}
