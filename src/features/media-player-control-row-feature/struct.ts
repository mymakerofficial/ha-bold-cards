import { array, enums, object, optional } from "superstruct";
import { controlConfigStruct } from "../../lib/controls/structs";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerControlRowFeature } from "./bold-media-player-control-row-feature";
import { ElementWhenUnavailable } from "../../lib/controls/types";

export const mediaPlayerControlRowFeatureStruct = object({
  type: exactMatch(BoldMediaPlayerControlRowFeature.getStubConfig().type),
  controls: optional(array(controlConfigStruct)),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
});
