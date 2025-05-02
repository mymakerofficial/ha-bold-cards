import { any, array, assign, object } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";

export const carouselCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    type: exactMatch(BoldCardType.CAROUSEL),
    cards: array(
      object({
        card: any(), // validated by editor
      }),
    ),
  }),
);
