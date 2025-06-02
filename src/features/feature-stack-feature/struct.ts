import { noneRecursiveFeatureConfigStruct } from "../../lib/features/structs";
import { BoldFeatureType } from "../../lib/features/types";
import z from "zod";

export const featureStackFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.FEATURE_STACK),
  get features() {
    return z.array(noneRecursiveFeatureConfigStruct).optional();
  },
});
