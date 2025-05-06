import { LovelaceCardConfig } from "../../types/ha/lovelace";
import {
  CarouselCardCardConfig,
  CarouselCardCardEntry,
  CarouselCardConfig,
} from "./types";
import { omit } from "../../lib/helpers";

export function enrichCarouselCardConfig({
  config,
  entry,
}: {
  config: CarouselCardConfig;
  entry: CarouselCardCardEntry;
}): LovelaceCardConfig {
  return {
    ...entry.card,
    type: entry.card.type,
    view_layout: config.view_layout,
    grid_options: config.grid_options,
  };
}

export function stripCarouselCardConfig(
  config: LovelaceCardConfig,
): CarouselCardCardConfig {
  return omit(config, [
    "view_layout",
    "layout_options",
    "grid_options",
    "visibility",
  ]);
}
