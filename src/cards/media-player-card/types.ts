import { LovelaceCardConfigWithFeatures } from "../../types/card";
import { ControlConfig } from "../../lib/controls/types";
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
  INLINE: "inline",
  TOP_CENTER: "top_center",
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
