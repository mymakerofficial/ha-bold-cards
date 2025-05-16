const _BoldCardType = {
  MEDIA_PLAYER: "custom:bold-media-player-card",
  BATTERY: "custom:bold-battery-card",
  CAROUSEL: "custom:bold-carousel-card",
  ENTITY_CAROUSEL: "custom:bold-entity-carousel-card",
  AT_A_GLANCE: "custom:bold-at-a-glance-card",
  MINI_WEATHER: "custom:bold-mini-weather-card",
} as const;
export const BoldCardType = _BoldCardType;
export type BoldCardType = (typeof _BoldCardType)[keyof typeof _BoldCardType];
export type BoldCardTypes = typeof _BoldCardType;
