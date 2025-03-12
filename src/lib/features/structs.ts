import { typedUnion } from "../struct";
import { mediaPlayerControlRowFeatureStruct } from "../../features/media-player-control-row-feature/struct";
import { BoldMediaPlayerControlRowFeature } from "../../features/media-player-control-row-feature/bold-media-player-control-row-feature";
import { any, array, optional } from "superstruct";

export const featureConfigStruct = typedUnion({
  name: "featureConfig",
  key: "type",
  structs: {
    [BoldMediaPlayerControlRowFeature.getStubConfig().type]:
      mediaPlayerControlRowFeatureStruct,
  },
  default: any(),
});

export const featuresStruct = optional(array(featureConfigStruct));
