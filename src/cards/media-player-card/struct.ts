import { assign, boolean, enums, object, optional, string } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import {
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
} from "./types";
import { featuresStruct } from "../../lib/features/structs";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";
import {
  InlinePosition,
  InlinePositions,
  Position,
  TopRowPositions,
  VerticalPosition,
} from "../../lib/layout/position";

export const mediaPlayerCardBaseConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    // not optional but needs to be marked as such to ensure the editor stays available when the entity is missing
    entity: optional(string()),
    color_mode: enums(Object.values(MediaPlayerCardColorMode)),
    color: optional(string()),
    universal_media_player_enhancements: optional(
      universalMediaPlayerEnhancementsStruct,
    ),
  }),
);

export const mediaPlayerAllowedPicturePositions = [
  ...TopRowPositions,
  ...InlinePositions,
];
export const mediaPlayerAllowedTextPositions = Object.values(Position);
export const mediaPlayerAllowedFeaturePositions = [
  InlinePosition.INLINE_RIGHT,
  VerticalPosition.BOTTOM,
];

export const mediaPlayerCardConfigStruct = assign(
  mediaPlayerCardBaseConfigStruct,
  object({
    type: exactMatch(BoldCardType.MEDIA_PLAYER),
    picture_position: optional(enums(mediaPlayerAllowedPicturePositions)),
    show_picture: optional(boolean()),
    background_picture: optional(
      enums(Object.values(MediaPlayerCardBackgroundPictureStyle)),
    ),
    text_position: optional(enums(mediaPlayerAllowedTextPositions)),
    show_text: optional(boolean()),
    feature_position: enums(mediaPlayerAllowedFeaturePositions),
    show_title_bar: optional(boolean()),
    placeholder_when_off: optional(boolean()),
    features: featuresStruct,
  }),
);
