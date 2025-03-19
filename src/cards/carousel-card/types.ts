import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldMediaPlayerCardConfig } from "../media-player-card/types";
import { BoldCardTypes } from "../../lib/cards/types";

type CardConfigs = BoldMediaPlayerCardConfig;

export type CarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["CAROUSEL"];
  entities: string[];
  card: Omit<
    CardConfigs,
    "entity" | "view_layout" | "layout_options" | "grid_options" | "visibility"
  >;
};
