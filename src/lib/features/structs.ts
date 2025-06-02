import { mediaPlayerControlRowFeatureStruct } from "../../features/media-player-control-row-feature/struct";
import { mediaPlayerSourceSelectFeatureStruct } from "../../features/media-player-source-select-feature/struct";
import { mediaPlayerMediaBrowserFeatureStruct } from "../../features/media-player-media-browser-feature/struct";
import z from "zod";
import { featureStackFeatureStruct } from "../../features/feature-stack-feature/struct";

const featureStructs = [
  mediaPlayerControlRowFeatureStruct,
  mediaPlayerSourceSelectFeatureStruct,
  mediaPlayerMediaBrowserFeatureStruct,
] as const;

const recursiveFeatureStructs = [featureStackFeatureStruct];

export const featureConfigStruct = z
  .discriminatedUnion("type", [...featureStructs, ...recursiveFeatureStructs])
  .or(z.any());

export const noneRecursiveFeatureConfigStruct = z
  .discriminatedUnion("type", featureStructs)
  .or(z.any());

export const featuresStruct = featureConfigStruct.array().optional();
