import { LovelaceCardFeatureConfig } from "../../types/ha/feature";
import { LovelaceCardConfig } from "../../types/ha/lovelace";

export interface FeatureInternals {
  parent_card_type: string;
  is_inlined: boolean;
}

export interface FeatureConfigInternals {
  __bold_custom_internals: FeatureInternals;
}

export type FeatureConfigWithMaybeInternals<
  TConfig extends LovelaceCardFeatureConfig = LovelaceCardFeatureConfig,
> = TConfig & Partial<FeatureConfigInternals>;

export interface CardInternals {
  parent_card_type: string;
}

export interface CardConfigInternals {
  __bold_custom_internals: CardInternals;
}

export type CardConfigWithMaybeInternals<
  TConfig extends LovelaceCardConfig = LovelaceCardConfig,
> = TConfig & Partial<CardConfigInternals>;
