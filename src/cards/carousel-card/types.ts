import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";
import { LovelaceCardConfigWithEntity } from "../../types/card";

type CardConfigs = LovelaceCardConfigWithEntity;

export type CarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["CAROUSEL"];
  entities: string[];
  card?: Omit<
    CardConfigs,
    "entity" | "view_layout" | "layout_options" | "grid_options" | "visibility"
  >;
};
