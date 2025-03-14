import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";

export interface BoldFeatureStackFeatureConfig {
  type: "custom:bold-feature-stack";
  features?: FeatureConfigWithMaybeInternals[];
}
