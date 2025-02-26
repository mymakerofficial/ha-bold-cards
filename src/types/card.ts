import { LovelaceCardConfig } from "./ha/lovelace";
import { FeatureConfigWithMaybeInternals } from "./ha/feature";

export type LovelaceCardConfigWithFeatures<TConfig = LovelaceCardConfig> =
  TConfig & {
    features?: FeatureConfigWithMaybeInternals[];
  };
