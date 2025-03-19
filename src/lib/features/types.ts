const _BoldFeatureType = {
  MEDIA_PLAYER_CONTROL_ROW: "custom:bold-media-player-control-row",
  MEDIA_PLAYER_SOURCE_SELECT: "custom:bold-media-player-source-select",
  MEDIA_PLAYER_MEDIA_BROWSER: "custom:bold-media-player-media-browser",
  FEATURE_STACK: "custom:bold-feature-stack",
} as const;
export const BoldFeatureType = _BoldFeatureType;
export type BoldFeatureType =
  (typeof _BoldFeatureType)[keyof typeof _BoldFeatureType];
export type BoldFeatureTypes = typeof _BoldFeatureType;
