import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { CarouselCardConfig } from "./types";

export function getCarouselCardConfig({
  config,
  entity,
  index = 0,
}: {
  config: CarouselCardConfig;
  entity?: string;
  index?: number;
}): LovelaceCardConfig {
  return {
    ...(config.card ?? {}),
    type: config.card?.type ?? "",
    entity: entity ?? config.entities[index],
    view_layout: config.view_layout,
    grid_options: config.grid_options,
    visibility: config.visibility,
  };
}
