import { object, optional } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerMediaBrowserFeature } from "./bold-media-player-media-browser-feature";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { BoldFeatureType } from "../../lib/features/types";

export const mediaPlayerMediaBrowserFeatureStruct = object({
  type: exactMatch(BoldFeatureType.MEDIA_PLAYER_MEDIA_BROWSER),
  universal_media_player_enhancements: optional(
    universalMediaPlayerEnhancementsStruct,
  ),
});
