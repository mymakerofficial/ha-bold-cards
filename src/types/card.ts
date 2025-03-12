import { LovelaceCardConfig } from "./ha/lovelace";
import { LovelaceCardFeatureConfig } from "./ha/feature";
import {
  FeatureConfigWithMaybeInternals,
  FeatureInternals,
} from "../lib/internals/types";

export interface CustomCardEntry {
  type: string;
  name?: string;
  description?: string;
  preview?: boolean;
  documentationURL?: string;
}

export interface GetFeatureInternalsContext<TConfig = LovelaceCardConfig> {
  config?: TConfig;
  feature: LovelaceCardFeatureConfig;
  featureIndex: number;
}

export interface CustomCardInternalsEntry<TConfig = LovelaceCardConfig> {
  getFeatureInternals?: (
    context: GetFeatureInternalsContext<TConfig>,
  ) => FeatureInternals;
}

export interface CustomCardEntryWithInternals<TConfig = LovelaceCardConfig>
  extends CustomCardEntry,
    CustomCardInternalsEntry<TConfig> {}

export type LovelaceCardConfigWithEntity<TConfig = LovelaceCardConfig> =
  TConfig & {
    entity: string;
  };

export type LovelaceCardConfigWithFeatures<
  TConfig = LovelaceCardConfigWithEntity,
> = TConfig & {
  features?: FeatureConfigWithMaybeInternals[];
};
