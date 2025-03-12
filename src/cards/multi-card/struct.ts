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
import { typedUnion } from "../../lib/struct";
import { mediaPlayerCardConfigStruct } from "../media-player-card/struct";

export const multiCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entities: optional(array(string())),
    card: typedUnion({
      key: "type",
      structs: {
        ["custom:bold-media-player-card"]: omit(mediaPlayerCardConfigStruct, [
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
