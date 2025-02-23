import { LovelaceCardConfig } from "./ha/lovelace";
import { LovelaceCardFeatureConfig } from "./ha/feature";

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
  features?: LovelaceCardFeatureConfig[];
}
