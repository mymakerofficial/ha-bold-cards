const _BoldCardType = {
  MEDIA_PLAYER: "custom:bold-media-player-card",
  RECORD_PLAYER: "custom:bold-record-player-card",
  AIR_QUALITY: "custom:bold-air-quality-card",
  BATTERY: "custom:bold-battery-card",
  CAROUSEL: "custom:bold-carousel-card",
  AT_A_GLANCE: "custom:bold-at-a-glance-card",
} as const;
export const BoldCardType = _BoldCardType;
export type BoldCardType = (typeof _BoldCardType)[keyof typeof _BoldCardType];
export type BoldCardTypes = typeof _BoldCardType;
