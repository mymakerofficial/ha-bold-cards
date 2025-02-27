import { MediaControlAction } from "../../helpers/media-player";
import { LovelaceCardConfigWithFeatures } from "../../types/card";

export const MediaPlayerTileContentLayout = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
export type MediaPlayerTileContentLayout =
  (typeof MediaPlayerTileContentLayout)[keyof typeof MediaPlayerTileContentLayout];

export const MediaPlayerTileColorMode = {
  AMBIENT: "ambient",
  AMBIENT_VIBRANT: "ambient_vibrant",
  PICTURE: "picture",
  MANUAL: "manual",
};
export type MediaPlayerTileColorMode =
  (typeof MediaPlayerTileColorMode)[keyof typeof MediaPlayerTileColorMode];

export interface MediaPlayerTileConfig extends LovelaceCardConfigWithFeatures {
  entity: string;
  color_mode: MediaPlayerTileColorMode;
  color?: string;
  content_layout: MediaPlayerTileContentLayout;
  show_title_bar?: boolean;
  controls?: MediaControlAction[];
}
