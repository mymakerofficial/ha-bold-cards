import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { CarouselCardConfig } from "./types";

export function getCarouselCardConfig({
  config,
}: {
  config: CarouselCardConfig;
}): LovelaceCardConfig {
  return {
    ...(config.card ?? {}),
    type: config.card?.type ?? "",
    view_layout: config.view_layout,
    grid_options: config.grid_options,
    visibility: config.visibility,
  };
}
