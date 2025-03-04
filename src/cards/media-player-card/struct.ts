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
  MediaPlayerCardColorMode,
  MediaPlayerCardContentLayout,
} from "./types";
import { mediaButtonControlConfigStruct } from "../../lib/controls/structs";

export const mediaPlayerCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: string(),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    content_layout: enums(Object.values(MediaPlayerCardContentLayout)),
    // only media buttons are allowed here
    controls: optional(array(mediaButtonControlConfigStruct)),
    show_title_bar: optional(boolean()),
    features: optional(array(any())),
  }),
);
