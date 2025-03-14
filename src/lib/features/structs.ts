import { typedUnion } from "../struct";
import { mediaPlayerControlRowFeatureStruct } from "../../features/media-player-control-row-feature/struct";
import { BoldMediaPlayerControlRowFeature } from "../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import { any, array, optional } from "superstruct";
import { BoldMediaPlayerSourceSelectFeature } from "../../features/media-player-source-select-feature/bold-media-player-source-select-feature";
import { mediaPlayerSourceSelectFeatureStruct } from "../../features/media-player-source-select-feature/struct";
import { BoldMediaPlayerMediaBrowserFeature } from "../../features/media-player-media-browser-feature/bold-media-player-media-browser-feature";
import { mediaPlayerMediaBrowserFeatureStruct } from "../../features/media-player-media-browser-feature/struct";

export const featureConfigStruct = typedUnion({
  name: "featureConfig",
  key: "type",
  structs: {
    [BoldMediaPlayerControlRowFeature.getStubConfig().type]:
      mediaPlayerControlRowFeatureStruct,
    [BoldMediaPlayerSourceSelectFeature.getStubConfig().type]:
      mediaPlayerSourceSelectFeatureStruct,
    [BoldMediaPlayerMediaBrowserFeature.getStubConfig().type]:
      mediaPlayerMediaBrowserFeatureStruct,
    // TODO recursion???
    // [BoldFeatureStackFeature.getStubConfig().type]:
    //   featureStackFeatureStruct as Struct<any>,
  },
  default: any(),
});

export const featuresStruct = optional(array(featureConfigStruct));
