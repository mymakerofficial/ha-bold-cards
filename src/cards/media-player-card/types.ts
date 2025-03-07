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
  LARGE_LEFT: "large_left",
  LARGE_RIGHT: "large_right",
  HIDE: "hide",
} as const;
export type MediaPlayerCardPicturePosition =
  (typeof MediaPlayerCardPicturePosition)[keyof typeof MediaPlayerCardPicturePosition];

export const MediaPlayerCardAlignment = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;
export type MediaPlayerCardAlignment =
  (typeof MediaPlayerCardAlignment)[keyof typeof MediaPlayerCardAlignment];

export interface MediaPlayerTileConfig extends LovelaceCardConfigWithFeatures {
  entity: string;
  color_mode: MediaPlayerCardColorMode;
  color?: string;
  picture_position: MediaPlayerCardPicturePosition;
  info_alignment: MediaPlayerCardAlignment;
  feature_position: CardFeaturePosition;
  show_title_bar?: boolean;
}
