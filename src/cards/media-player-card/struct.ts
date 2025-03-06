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
  MediaPlayerCardAlignment,
  MediaPlayerCardColorMode,
  MediaPlayerCardPicturePosition,
} from "./types";
import { CardFeaturePosition } from "../types";

export const mediaPlayerCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    // not optional but needs to be marked as such to ensure the editor stays available when the entity is missing
    entity: optional(string()),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    picture_position: enums(Object.values(MediaPlayerCardPicturePosition)),
    info_alignment: enums(Object.values(MediaPlayerCardAlignment)),
    feature_position: enums(Object.values(CardFeaturePosition)),
    show_title_bar: optional(boolean()),
    features: optional(array(any())),
  }),
);
