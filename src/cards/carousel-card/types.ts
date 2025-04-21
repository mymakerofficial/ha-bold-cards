import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";

export type CarouselCardCardConfig = Omit<
  LovelaceCardConfig,
  "view_layout" | "layout_options" | "grid_options" | "visibility"
>;

export type CarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["CAROUSEL"];
  cards: CarouselCardCardConfig[];
};
