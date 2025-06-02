import { controlConfigStruct } from "../../lib/controls/structs";
import { ElementWhenUnavailable } from "../../lib/controls/types";
import { BoldFeatureType } from "../../lib/features/types";
import z from "zod";
import { enums } from "../../lib/struct";

export const mediaPlayerControlRowFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.MEDIA_PLAYER_CONTROL_ROW),
  controls: controlConfigStruct.array().optional(),
  when_unavailable: enums(ElementWhenUnavailable).optional(),
});
