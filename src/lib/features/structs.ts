import { mediaPlayerControlRowFeatureStruct } from "../../features/media-player-control-row-feature/struct";
import { mediaPlayerSourceSelectFeatureStruct } from "../../features/media-player-source-select-feature/struct";
import { mediaPlayerMediaBrowserFeatureStruct } from "../../features/media-player-media-browser-feature/struct";
import z from "zod";
// import { featureStackFeatureStruct } from "../../features/feature-stack-feature/struct";

export const featureConfigStruct = z
  .discriminatedUnion("type", [
    mediaPlayerControlRowFeatureStruct,
    mediaPlayerSourceSelectFeatureStruct,
    mediaPlayerMediaBrowserFeatureStruct,
    // featureStackFeatureStruct,
  ])
  .or(z.any());

export const featuresStruct = featureConfigStruct.array().optional();
