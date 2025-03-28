import { LovelaceCardConfigWithFeatures } from "../../types/card";
import { CardFeaturePosition } from "../types";
import { UniversalMediaPlayerEnhancements } from "../../lib/media-player/universal-media-player";
import { BoldCardTypes } from "../../lib/cards/types";

export const MediaPlayerCardColorMode = {
  AMBIENT: "ambient",
  AMBIENT_VIBRANT: "ambient_vibrant",
  AMBIENT_SOLID: "ambient_solid",
  MANUAL: "manual",
} as const;
export type MediaPlayerCardColorMode =
  (typeof MediaPlayerCardColorMode)[keyof typeof MediaPlayerCardColorMode];

export const MediaPlayerCardPicturePosition = {
  INLINE_LEFT: "inline_left",
  INLINE_RIGHT: "inline_right",
  TOP_LEFT: "top_left",
  TOP_CENTER: "top_center",
  TOP_RIGHT: "top_right",
  HIDE: "hide",
} as const;
export type MediaPlayerCardPicturePosition =
  (typeof MediaPlayerCardPicturePosition)[keyof typeof MediaPlayerCardPicturePosition];

export const MediaPlayerCardBackgroundPictureStyle = {
  HIDE: "hide",
  COVER: "cover",
} as const;
export type MediaPlayerCardBackgroundPictureStyle =
  (typeof MediaPlayerCardBackgroundPictureStyle)[keyof typeof MediaPlayerCardBackgroundPictureStyle];

export const MediaPlayerCardHorizontalAlignment = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type MediaPlayerCardHorizontalAlignment =
  (typeof MediaPlayerCardHorizontalAlignment)[keyof typeof MediaPlayerCardHorizontalAlignment];

export const MediaPlayerCardVerticalAlignment = {
  BOTTOM: "bottom",
  CENTER: "center",
  TOP: "top",
} as const;
export type MediaPlayerCardVerticalAlignment =
  (typeof MediaPlayerCardVerticalAlignment)[keyof typeof MediaPlayerCardVerticalAlignment];

export interface BoldMediaPlayerCardBaseConfig
  extends LovelaceCardConfigWithFeatures {
  color_mode: MediaPlayerCardColorMode;
  color?: string;
  universal_media_player_enhancements?: UniversalMediaPlayerEnhancements;
}

export interface BoldMediaPlayerCardConfig
  extends BoldMediaPlayerCardBaseConfig {
  type: BoldCardTypes["MEDIA_PLAYER"];
  picture_position?: MediaPlayerCardPicturePosition;
  background_picture?: MediaPlayerCardBackgroundPictureStyle;
  content_horizontal_alignment: MediaPlayerCardHorizontalAlignment;
  content_vertical_alignment: MediaPlayerCardVerticalAlignment;
  hide_content?: boolean;
  feature_position: CardFeaturePosition;
  show_title_bar?: boolean;
  placeholder_when_off?: boolean;
}
