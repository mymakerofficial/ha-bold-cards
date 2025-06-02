import { BoldFeatureType } from "../../lib/features/types";
import z from "zod";
import { noneRecursiveFeatureConfigStruct } from "../../lib/features/noneRecursiveStructs";

export const featureStackFeatureStruct = z.object({
  type: z.literal(BoldFeatureType.FEATURE_STACK),
  features: z.array(noneRecursiveFeatureConfigStruct).optional(),
});
