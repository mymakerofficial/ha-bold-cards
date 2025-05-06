import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { EntityCarouselCardConfig } from "./types";

export function getEntityCarouselCardConfig({
  config,
  entity,
  index = 0,
}: {
  config: EntityCarouselCardConfig;
  entity?: string;
  index?: number;
}): LovelaceCardConfig {
  return {
    ...(config.card ?? {}),
    type: config.card?.type ?? "",
    entity: entity ?? config.entities[index],
    view_layout: config.view_layout,
    grid_options: config.grid_options,
  };
}
