import { array, enums, object, optional } from "superstruct";
import { controlConfigStruct } from "../../lib/controls/structs";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerSourceSelectFeature } from "./bold-media-player-source-select-feature";
import { ElementWhenUnavailable } from "../../lib/controls/types";

export const mediaPlayerControlRowFeatureStruct = object({
  type: exactMatch(BoldMediaPlayerSourceSelectFeature.getStubConfig().type),
  controls: optional(array(controlConfigStruct)),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
});
