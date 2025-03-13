import {
  HassEntityAttributeBase,
  HassEntityBase,
} from "home-assistant-js-websocket";

export const EntityState = {
  UNAVAILABLE: "unavailable",
  UNKNOWN: "unknown",
  ON: "on",
  OFF: "off",
} as const;
export type EntityState = (typeof EntityState)[keyof typeof EntityState];

export const MediaPlayerState = {
  ...EntityState,
  PLAYING: "playing",
  PAUSED: "paused",
  IDLE: "idle",
  STANDBY: "standby",
  BUFFERING: "buffering",
} as const;
export type MediaPlayerState =
  (typeof MediaPlayerState)[keyof typeof MediaPlayerState];

export const MediaContentType = {
  MUSIC: "music",
  VIDEO: "video",
  IMAGE: "image",
  PLAYLIST: "playlist",
  TVSHOW: "tvshow",
  EPISODE: "episode",
  CHANNEL: "channel",
};
export type MediaContentType =
  (typeof MediaContentType)[keyof typeof MediaContentType];

export const MediaPlayerRepeat = {
  OFF: "off",
  ALL: "all",
  ONE: "one",
} as const;
export type MediaPlayerRepeat =
  (typeof MediaPlayerRepeat)[keyof typeof MediaPlayerRepeat];

interface MediaPlayerEntityAttributes extends HassEntityAttributeBase {
  media_content_id?: string;
  media_content_type?: MediaContentType;
  media_artist?: string;
  media_playlist?: string;
  media_series_title?: string;
  media_season?: any;
  media_episode?: any;
  app_name?: string;
  media_position_updated_at?: string | number | Date;
  media_duration?: number;
  media_position?: number;
  media_title?: string;
  media_channel?: string;
  icon?: string;
  entity_picture_local?: string;
  is_volume_muted?: boolean;
  volume_level?: number;
  repeat?: MediaPlayerRepeat;
  shuffle?: boolean;
  source?: string;
  source_list?: string[];
  sound_mode?: string;
  sound_mode_list?: string[];
  active_child?: string;
}

export interface MediaPlayerEntity extends HassEntityBase {
  attributes: MediaPlayerEntityAttributes;
  state: MediaPlayerState;
}
