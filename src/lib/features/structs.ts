import z from "zod";
import { featureStackFeatureStruct } from "../../features/feature-stack-feature/struct";
import { featureStructs } from "./noneRecursiveStructs";

const recursiveFeatureStructs = [featureStackFeatureStruct] as const;

export const featureConfigStruct = z
  .discriminatedUnion("type", [...featureStructs, ...recursiveFeatureStructs])
  .or(
    z
      .object({
        type: z.string(),
      })
      .passthrough(),
  );

export const featuresStruct = featureConfigStruct.array().optional();
