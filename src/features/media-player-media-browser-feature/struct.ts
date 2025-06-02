import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { BoldFeatureType } from "../../lib/features/types";
import z from "zod";

export const mediaPlayerMediaBrowserFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.MEDIA_PLAYER_MEDIA_BROWSER),
  universal_media_player_enhancements:
    universalMediaPlayerEnhancementsStruct.optional(),
});
