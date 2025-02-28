import { MediaControlAction } from "../../helpers/media-player";
import { LovelaceCardConfigWithFeatures } from "../../types/card";

export const MediaPlayerCardContentLayout = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
export type MediaPlayerCardContentLayout =
  (typeof MediaPlayerCardContentLayout)[keyof typeof MediaPlayerCardContentLayout];

export const MediaPlayerCardColorMode = {
  AMBIENT: "ambient",
  AMBIENT_VIBRANT: "ambient_vibrant",
  PICTURE: "picture",
  MANUAL: "manual",
};
export type MediaPlayerCardColorMode =
  (typeof MediaPlayerCardColorMode)[keyof typeof MediaPlayerCardColorMode];

export interface MediaPlayerTileConfig extends LovelaceCardConfigWithFeatures {
  entity: string;
  color_mode: MediaPlayerCardColorMode;
  color?: string;
  content_layout: MediaPlayerCardContentLayout;
  show_title_bar?: boolean;
  controls?: MediaControlAction[];
}
