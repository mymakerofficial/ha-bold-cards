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

export type CarouselCardBaseConfig = LovelaceCardConfig & {
  stepper_position?: Position;
};

export type CarouselCardConfig = CarouselCardBaseConfig & {
  cards: CarouselCardCardEntry[];
};
