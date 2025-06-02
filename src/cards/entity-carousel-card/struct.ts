import { BoldCardType } from "../../lib/cards/types";
import { carouselCardConfigBaseStruct } from "../carousel-card/struct";
import z from "zod";

export const entityCarouselCardConfigStruct =
  carouselCardConfigBaseStruct.extend({
    type: z.literal(BoldCardType.ENTITY_CAROUSEL),
    entities: z.string().array().optional(),
    remove_inactive_entities: z.boolean().optional(),
    card: z.any().optional(), // validated by editor
  });
