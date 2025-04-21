import { any, array, assign, object, optional, string } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";

export const entityCarouselCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    type: exactMatch(BoldCardType.ENTITY_CAROUSEL),
    entities: optional(array(string())),
    card: optional(any()), // validated by editor
  }),
);
