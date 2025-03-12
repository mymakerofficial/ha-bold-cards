import { assign, boolean, enums, object, optional, string } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import {
  MediaPlayerCardColorMode,
  MediaPlayerCardHorizontalAlignment,
  MediaPlayerCardPicturePosition,
  MediaPlayerCardVerticalAlignment,
} from "./types";
import { CardFeaturePosition } from "../types";
import { featuresStruct } from "../../lib/features/structs";

export const mediaPlayerCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    // not optional but needs to be marked as such to ensure the editor stays available when the entity is missing
    entity: optional(string()),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    picture_position: enums(Object.values(MediaPlayerCardPicturePosition)),
    horizontal_alignment: enums(
      Object.values(MediaPlayerCardHorizontalAlignment),
    ),
    vertical_alignment: enums(Object.values(MediaPlayerCardVerticalAlignment)),
    feature_position: enums(Object.values(CardFeaturePosition)),
    show_title_bar: optional(boolean()),
    hide_media_info: optional(boolean()),
    placeholder_when_off: optional(boolean()),
    features: featuresStruct,
  }),
);
