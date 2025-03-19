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
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { exactMatch } from "../../lib/struct";
import { BoldCardType } from "../../lib/cards/types";

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

export const mediaPlayerCardConfigStruct = assign(
  mediaPlayerCardBaseConfigStruct,
  object({
    type: exactMatch(BoldCardType.MEDIA_PLAYER),
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
