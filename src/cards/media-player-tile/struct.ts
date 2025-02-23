import {
  any,
  array,
  assign,
  enums,
  object,
  optional,
  string,
} from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import {
  MediaPlayerTileColorMode,
  MediaPlayerTileContentLayout,
} from "../../types/tile";

export const cardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    color_mode: optional(enums(Object.values(MediaPlayerTileColorMode))),
    color: optional(string()),
    content_layout: optional(
      enums(Object.values(MediaPlayerTileContentLayout)),
    ),
    features: optional(array(any())),
    features_position: optional(enums(["bottom", "inline"])),
  }),
);
