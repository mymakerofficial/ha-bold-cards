import { any, array, assign, enums, object, optional } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";
import { BottomRowPositions, TopRowPositions } from "../../lib/layout/position";
import { CarouselStepperStyle } from "../../components/bc-carousel";

export const carouselCardAllowedStepperPositions = [
  ...TopRowPositions,
  ...BottomRowPositions,
];

export const carouselCardConfigBaseStruct = assign(
  baseLovelaceCardConfig,
  object({
    stepper_position: optional(enums(carouselCardAllowedStepperPositions)),
    stepper_style: optional(enums(Object.values(CarouselStepperStyle))),
  }),
);

export const carouselCardConfigStruct = assign(
  carouselCardConfigBaseStruct,
  object({
    type: exactMatch(BoldCardType.CAROUSEL),
    cards: array(
      object({
        card: any(), // validated by editor
      }),
    ),
  }),
);
