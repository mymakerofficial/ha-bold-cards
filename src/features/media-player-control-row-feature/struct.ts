import { controlConfigStruct } from "../../lib/controls/structs";
import { ElementWhenUnavailable } from "../../lib/controls/types";
import { BoldFeatureType } from "../../lib/features/types";
import { z } from "zod/v4";

export const mediaPlayerControlRowFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.MEDIA_PLAYER_CONTROL_ROW),
  controls: controlConfigStruct.array().optional(),
  when_unavailable: z.enum(ElementWhenUnavailable).optional(),
});
