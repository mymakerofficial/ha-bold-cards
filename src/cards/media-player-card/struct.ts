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
import { controlConfigStruct } from "../../lib/controls/structs";

export const mediaPlayerCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    // not optional but needs to be marked as such to ensure the editor stays available when the entity is missing
    entity: optional(string()),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    content_layout: enums(Object.values(MediaPlayerCardContentLayout)),
    controls: optional(array(controlConfigStruct)),
    show_title_bar: optional(boolean()),
    features: optional(array(any())),
  }),
);
