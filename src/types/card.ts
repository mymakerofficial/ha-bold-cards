import { LovelaceCardConfig } from "./ha/lovelace";
import { FeatureConfigWithMaybeInternals } from "./ha/feature";

export interface CustomCardEntry {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}

export type LovelaceCardConfigWithEntity<TConfig = LovelaceCardConfig> =
  TConfig & {
    entity: string;
  };

export type LovelaceCardConfigWithFeatures<
  TConfig = LovelaceCardConfigWithEntity,
> = TConfig & {
  features?: FeatureConfigWithMaybeInternals[];
};
