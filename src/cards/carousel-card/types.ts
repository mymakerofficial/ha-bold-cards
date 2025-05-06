import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { Position } from "../../lib/layout/position";
import { CarouselStepperStyle } from "../../components/bc-carousel";

export type CarouselCardCardConfig = Omit<
  LovelaceCardConfig,
  "view_layout" | "layout_options" | "grid_options" | "visibility"
>;

export type CarouselCardCardEntry = {
  card: CarouselCardCardConfig;
};

export type CarouselCardBaseConfig = LovelaceCardConfig & {
  stepper_position?: Position;
  stepper_style?: CarouselStepperStyle;
};

export type CarouselCardConfig = CarouselCardBaseConfig & {
  cards: CarouselCardCardEntry[];
};
