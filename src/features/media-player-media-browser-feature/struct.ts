import { object, optional } from "superstruct";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerMediaBrowserFeature } from "./bold-media-player-media-browser-feature";
import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";

export const mediaPlayerMediaBrowserFeatureStruct = object({
  type: exactMatch(BoldMediaPlayerMediaBrowserFeature.getStubConfig().type),
  universal_media_player_enhancements: optional(
    universalMediaPlayerEnhancementsStruct,
  ),
});
