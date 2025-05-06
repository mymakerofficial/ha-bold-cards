import { LovelaceCardConfigWithFeatures } from "../../types/card";
import { UniversalMediaPlayerEnhancements } from "../../lib/media-player/universal-media-player";
import { BoldCardTypes } from "../../lib/cards/types";
import {
  mediaPlayerAllowedFeaturePositions,
  mediaPlayerAllowedPicturePositions,
  mediaPlayerAllowedTextPositions,
} from "./struct";

export const MediaPlayerCardColorMode = {
  AMBIENT: "ambient",
  AMBIENT_VIBRANT: "ambient_vibrant",
  AMBIENT_SOLID: "ambient_solid",
  MANUAL: "manual",
} as const;
export type MediaPlayerCardColorMode =
  (typeof MediaPlayerCardColorMode)[keyof typeof MediaPlayerCardColorMode];

export const MediaPlayerCardBackgroundPictureStyle = {
  HIDE: "hide",
  COVER: "cover",
} as const;
export type MediaPlayerCardBackgroundPictureStyle =
  (typeof MediaPlayerCardBackgroundPictureStyle)[keyof typeof MediaPlayerCardBackgroundPictureStyle];

export interface BoldMediaPlayerCardBaseConfig
  extends LovelaceCardConfigWithFeatures {
  color_mode: MediaPlayerCardColorMode;
  color?: string;
  universal_media_player_enhancements?: UniversalMediaPlayerEnhancements;
}

export interface BoldMediaPlayerCardConfig
  extends BoldMediaPlayerCardBaseConfig {
  type: BoldCardTypes["MEDIA_PLAYER"];
  picture_position?: (typeof mediaPlayerAllowedPicturePositions)[number];
  show_picture?: boolean;
  background_picture?: MediaPlayerCardBackgroundPictureStyle;
  text_position?: (typeof mediaPlayerAllowedTextPositions)[number];
  show_text?: boolean;
  feature_position: (typeof mediaPlayerAllowedFeaturePositions)[number];
  show_title_bar?: boolean;
  // TODO: replace with option to either show placeholder, do nothing or hide card
  //  see hui-conditional-card to see how to hide card
  placeholder_when_off?: boolean;
}
