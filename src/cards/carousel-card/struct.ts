import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";
import { BoldCardType } from "../../lib/cards/types";
import { BottomRowPositions, TopRowPositions } from "../../lib/layout/position";
import { CarouselStepperStyle } from "../../components/bc-carousel";
import z from "zod";
import { enums } from "../../lib/struct";

export const carouselCardAllowedStepperPositions = [
  ...TopRowPositions,
  ...BottomRowPositions,
];

export const carouselCardConfigBaseStruct = baseCardConfigStruct.extend({
  stepper_position: enums(carouselCardAllowedStepperPositions).optional(),
  stepper_style: enums(CarouselStepperStyle).optional(),
});

export const carouselCardConfigStruct = carouselCardConfigBaseStruct.extend({
  type: z.literal(BoldCardType.CAROUSEL),
  // TODO: zod supports async validation, maybe we can do the card validation here?
  cards: z
    .object({
      card: z.any(), // validated by editor
    })
    .array(),
});
