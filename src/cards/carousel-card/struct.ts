import { any, array, assign, enums, object, optional } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";
import { BottomRowPositions, TopRowPositions } from "../../lib/layout/position";

export const carouselCardAllowedStepperPositions = [
  ...TopRowPositions,
  ...BottomRowPositions,
];

export const carouselCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    type: exactMatch(BoldCardType.CAROUSEL),
    cards: array(
      object({
        card: any(), // validated by editor
      }),
    ),
    stepper_position: optional(enums(carouselCardAllowedStepperPositions)),
  }),
);
