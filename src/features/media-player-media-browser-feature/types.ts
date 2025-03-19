import { UniversalMediaPlayerEnhancements } from "../../lib/media-player/universal-media-player";
import { BoldFeatureTypes } from "../../lib/features/types";

export interface BoldMediaPlayerMediaBrowserFeatureConfig {
  type: BoldFeatureTypes["MEDIA_PLAYER_MEDIA_BROWSER"];
  universal_media_player_enhancements?: UniversalMediaPlayerEnhancements;
}
