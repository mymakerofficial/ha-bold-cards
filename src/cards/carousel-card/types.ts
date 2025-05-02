import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";
import { Position } from "../../lib/layout/position";

export type CarouselCardCardConfig = Omit<
  LovelaceCardConfig,
  "view_layout" | "layout_options" | "grid_options" | "visibility"
>;

export type CarouselCardCardEntry = {
  card: CarouselCardCardConfig;
};

export type CarouselCardConfig = LovelaceCardConfig & {
  type: BoldCardTypes["CAROUSEL"];
  cards: CarouselCardCardEntry[];
  stepper_position?: Position;
};
