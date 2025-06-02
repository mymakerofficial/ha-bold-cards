import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";
import {
  MediaPlayerCardBackgroundPictureStyle,
  MediaPlayerCardColorMode,
} from "./types";
import { featuresStruct } from "../../lib/features/structs";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { BoldCardType } from "../../lib/cards/types";
import {
  InlinePosition,
  InlinePositions,
  Position,
  TopRowPositions,
  VerticalPosition,
} from "../../lib/layout/position";
import z from "zod";
import { enums } from "../../lib/struct";

export const baseMediaPlayerCardConfigStruct = baseCardConfigStruct.extend({
  entity: z.string().optional(),
  color_mode: enums(MediaPlayerCardColorMode),
  color: z.string().optional(),
  universal_media_player_enhancements:
    universalMediaPlayerEnhancementsStruct.optional(),
});

export const mediaPlayerAllowedPicturePositions = [
  ...TopRowPositions,
  ...InlinePositions,
] as const;
export const mediaPlayerAllowedTextPositions = Object.values(Position);
export const mediaPlayerAllowedFeaturePositions = [
  InlinePosition.INLINE_RIGHT,
  VerticalPosition.BOTTOM,
];

export const mediaPlayerCardConfigStruct =
  baseMediaPlayerCardConfigStruct.extend({
    type: z.literal(BoldCardType.MEDIA_PLAYER),
    picture_position: enums(mediaPlayerAllowedPicturePositions).optional(),
    show_picture: z.boolean().optional(),
    background_picture: enums(MediaPlayerCardBackgroundPictureStyle).optional(),
    text_position: enums(mediaPlayerAllowedTextPositions).optional(),
    show_text: z.boolean().optional(),
    feature_position: enums(mediaPlayerAllowedFeaturePositions).optional(),
    show_title_bar: z.boolean().optional(),
    placeholder_when_off: z.boolean().optional(),
    features: featuresStruct,
  });
