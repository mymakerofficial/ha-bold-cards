import { mediaPlayerControlRowFeatureStruct } from "../../features/media-player-control-row-feature/struct";
import { mediaPlayerSourceSelectFeatureStruct } from "../../features/media-player-source-select-feature/struct";
import { mediaPlayerMediaBrowserFeatureStruct } from "../../features/media-player-media-browser-feature/struct";
import z from "zod";

// structs need to be split into two files, because of circular dependencies

export const featureStructs = [
  mediaPlayerControlRowFeatureStruct,
  mediaPlayerSourceSelectFeatureStruct,
  mediaPlayerMediaBrowserFeatureStruct,
] as const;

export const noneRecursiveFeatureConfigStruct = z
  .discriminatedUnion("type", featureStructs)
  .or(z.any());
