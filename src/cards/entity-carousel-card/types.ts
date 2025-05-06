import { BoldCardTypes } from "../../lib/cards/types";
import { LovelaceCardConfigWithEntity } from "../../types/card";
import { CarouselCardBaseConfig } from "../carousel-card/types";

export type EntityCarouselCardConfig = CarouselCardBaseConfig & {
  type: BoldCardTypes["ENTITY_CAROUSEL"];
  entities: string[];
  card?: Omit<
    LovelaceCardConfigWithEntity,
    "entity" | "view_layout" | "layout_options" | "grid_options" | "visibility"
  >;
};
