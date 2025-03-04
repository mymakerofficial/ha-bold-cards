import { array, object } from "superstruct";
import { controlConfigStruct } from "../../lib/controls/structs";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerControlRowFeature } from "./bold-media-player-control-row-feature";

export const mediaPlayerControlRowFeatureStruct = object({
  type: exactMatch(BoldMediaPlayerControlRowFeature.getStubConfig().type),
  controls: array(controlConfigStruct),
});
