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

export const cardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: string(),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    content_layout: enums(Object.values(MediaPlayerCardContentLayout)),
    controls: optional(array(controlConfigStruct)),
    show_title_bar: optional(boolean()),
    features: optional(array(any())),
  }),
);
