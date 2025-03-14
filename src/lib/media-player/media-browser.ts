import { HomeAssistant } from "../../types/ha/lovelace";

export const MediaItemClass = {
  ALBUM: "album",
  APP: "app",
  ARTIST: "artist",
  CHANNEL: "channel",
  COMPOSER: "composer",
  CONTRIBUTING_ARTIST: "contributing_artist",
  DIRECTORY: "directory",
  EPISODE: "episode",
  GAME: "game",
  GENRE: "genre",
  IMAGE: "image",
  MOVIE: "movie",
  MUSIC: "music",
  PLAYLIST: "playlist",
  PODCAST: "podcast",
  SEASON: "season",
  TRACK: "track",
  TV_SHOW: "tv_show",
  URL: "url",
  VIDEO: "vide",
} as const;
export type MediaItemClass =
  (typeof MediaItemClass)[keyof typeof MediaItemClass];

export interface MediaPlayerItem {
  title: string;
  media_content_type: string;
  media_content_id: string;
  media_class: MediaItemClass;
  children_media_class?: string;
  can_play: boolean;
  can_expand: boolean;
  thumbnail?: string;
  children?: MediaPlayerItem[];
  not_shown?: number;
}

export async function browseMediaPlayer(
  hass: HomeAssistant,
  entityId: string,
  mediaContentId?: string,
  mediaContentType?: string,
): Promise<MediaPlayerItem> {
  return hass.callWS<MediaPlayerItem>({
    type: "media_player/browse_media",
    entity_id: entityId,
    media_content_id: mediaContentId,
    media_content_type: mediaContentType,
  });
}
