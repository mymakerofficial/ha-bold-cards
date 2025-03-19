import { object, optional } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { BoldFeatureType } from "../../lib/features/types";

export const mediaPlayerSourceSelectFeatureStruct = object({
  type: exactMatch(BoldFeatureType.MEDIA_PLAYER_SOURCE_SELECT),
  universal_media_player_enhancements: optional(
    universalMediaPlayerEnhancementsStruct,
  ),
});
