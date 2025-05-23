import { universalMediaPlayerEnhancementsStruct } from "../../lib/media-player/universal-media-player";
import { BoldFeatureType } from "../../lib/features/types";
import z from "zod/v4";

export const mediaPlayerSourceSelectFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.MEDIA_PLAYER_SOURCE_SELECT),
  universal_media_player_enhancements:
    universalMediaPlayerEnhancementsStruct.optional(),
});
