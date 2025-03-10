import { LovelaceCardConfigWithFeatures } from "../../types/card";
import { CardFeaturePosition } from "../types";

export const MediaPlayerCardColorMode = {
  AMBIENT: "ambient",
  AMBIENT_VIBRANT: "ambient_vibrant",
  AMBIENT_SOLID: "ambient_solid",
  MANUAL: "manual",
} as const;
export type MediaPlayerCardColorMode =
  (typeof MediaPlayerCardColorMode)[keyof typeof MediaPlayerCardColorMode];

export const MediaPlayerCardPicturePosition = {
  BACKGROUND: "background",
  INLINE_LEFT: "inline_left",
  INLINE_RIGHT: "inline_right",
  TOP_LEFT: "top_left",
  TOP_CENTER: "top_center",
  TOP_RIGHT: "top_right",
  HIDE: "hide",
} as const;
export type MediaPlayerCardPicturePosition =
  (typeof MediaPlayerCardPicturePosition)[keyof typeof MediaPlayerCardPicturePosition];

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

export interface MediaPlayerTileConfig extends LovelaceCardConfigWithFeatures {
  entity: string;
  color_mode: MediaPlayerCardColorMode;
  color?: string;
  picture_position: MediaPlayerCardPicturePosition;
  horizontal_alignment: MediaPlayerCardHorizontalAlignment;
  vertical_alignment: MediaPlayerCardVerticalAlignment;
  feature_position: CardFeaturePosition;
  show_title_bar?: boolean;
}
