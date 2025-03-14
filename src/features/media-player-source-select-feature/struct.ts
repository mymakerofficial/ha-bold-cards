import { object, optional } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerSourceSelectFeature } from "./bold-media-player-source-select-feature";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";

export const mediaPlayerSourceSelectFeatureStruct = object({
  type: exactMatch(BoldMediaPlayerSourceSelectFeature.getStubConfig().type),
  universal_media_player_enhancements: optional(
    universalMediaPlayerEnhancementsStruct,
  ),
});
