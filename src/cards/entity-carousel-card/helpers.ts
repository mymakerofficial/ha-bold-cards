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
  // TODO: why isn't this LovelaceCardConfigWithEntity?
  return {
    ...(config.card ?? {}),
    type: config.card?.type ?? "",
    entity: entity ?? config.entities?.[index] ?? undefined,
    view_layout: config.view_layout,
    grid_options: config.grid_options,
  };
}
