import {
  any,
  array,
  assign,
  object,
  omit,
  optional,
  string,
} from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { exactMatch, typedUnion } from "../../lib/struct";
import { mediaPlayerCardConfigStruct } from "../media-player-card/struct";
import { BoldCardType } from "../../lib/cards/types";

export const multiCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    type: exactMatch(BoldCardType.MULTI),
    entities: optional(array(string())),
    card: typedUnion({
      key: "type",
      structs: {
        [BoldCardType.MEDIA_PLAYER]: omit(mediaPlayerCardConfigStruct, [
          "entity",
          "view_layout",
          "layout_options",
          "grid_options",
          "visibility",
        ]),
      },
    }),
  }),
);
