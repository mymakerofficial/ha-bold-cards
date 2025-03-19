import { UniversalMediaPlayerEnhancements } from "../../lib/media-player/universal-media-player";
import { BoldFeatureTypes } from "../../lib/features/types";

export interface BoldMediaPlayerSourceSelectFeatureConfig {
  type: BoldFeatureTypes["MEDIA_PLAYER_SOURCE_SELECT"];
  universal_media_player_enhancements?: UniversalMediaPlayerEnhancements;
}
