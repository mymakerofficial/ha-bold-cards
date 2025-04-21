import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";
import { LovelaceCardConfigWithEntity } from "../../types/card";

export type EntityCarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["ENTITY_CAROUSEL"];
  entities: string[];
  card?: Omit<
    LovelaceCardConfigWithEntity,
    "entity" | "view_layout" | "layout_options" | "grid_options" | "visibility"
  >;
};
