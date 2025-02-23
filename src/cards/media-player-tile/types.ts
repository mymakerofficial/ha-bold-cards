import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { LovelaceCardFeatureConfig } from "../../types/ha/feature";
import { MediaControlAction } from "../../helpers/media-player";

export const MediaPlayerTileContentLayout = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;
export type MediaPlayerTileContentLayout =
  (typeof MediaPlayerTileContentLayout)[keyof typeof MediaPlayerTileContentLayout];

export const MediaPlayerTileColorMode = {
  AMBIENT: "ambient",
  MANUAL: "manual",
};
export type MediaPlayerTileColorMode =
  (typeof MediaPlayerTileColorMode)[keyof typeof MediaPlayerTileColorMode];

export interface MediaPlayerTileConfig extends LovelaceCardConfig {
  entity: string;
  color_mode: MediaPlayerTileColorMode;
  color: string;
  content_layout: MediaPlayerTileContentLayout;
  controls: MediaControlAction[];
  features?: LovelaceCardFeatureConfig[];
}
