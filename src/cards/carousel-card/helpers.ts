import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { CarouselCardCardConfig, CarouselCardConfig } from "./types";

export function getCarouselCardConfig({
  config,
  card,
}: {
  config: CarouselCardConfig;
  card: CarouselCardCardConfig;
}): LovelaceCardConfig {
  return {
    ...card,
    type: card.type,
    view_layout: config.view_layout,
    grid_options: config.grid_options,
    visibility: config.visibility,
  };
}
