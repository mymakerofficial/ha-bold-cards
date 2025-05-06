import { any, array, assign, object, optional, string } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";
import { carouselCardConfigBaseStruct } from "../carousel-card/struct";

export const entityCarouselCardConfigStruct = assign(
  carouselCardConfigBaseStruct,
  object({
    type: exactMatch(BoldCardType.ENTITY_CAROUSEL),
    entities: optional(array(string())),
    card: optional(any()), // validated by editor
  }),
);
