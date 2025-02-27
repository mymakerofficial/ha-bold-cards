import {
  any,
  array,
  assign,
  boolean,
  enums,
  object,
  optional,
  string,
} from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import {
  MediaPlayerTileColorMode,
  MediaPlayerTileContentLayout,
} from "./types";
import { MediaControlAction } from "../../helpers/media-player";

export const cardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: string(),
    color_mode: enums(Object.values(MediaPlayerTileColorMode)),
    color: optional(string()),
    content_layout: enums(Object.values(MediaPlayerTileContentLayout)),
    controls: optional(array(enums(Object.values(MediaControlAction)))),
    show_title_bar: optional(boolean()),
    features: optional(array(any())),
  }),
);
