import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";

export type CarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["CAROUSEL"];
  cards: Omit<
    LovelaceCardConfig,
    "view_layout" | "layout_options" | "grid_options" | "visibility"
  >[];
};
