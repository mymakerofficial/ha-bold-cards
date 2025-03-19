import { array, enums, object, optional } from "superstruct";
import { controlConfigStruct } from "../../lib/controls/structs";
import { exactMatch } from "../../lib/struct";
import { BoldMediaPlayerControlRowFeature } from "./bold-media-player-control-row-feature";
import { ElementWhenUnavailable } from "../../lib/controls/types";
import { BoldFeatureType } from "../../lib/features/types";

export const mediaPlayerControlRowFeatureStruct = object({
  type: exactMatch(BoldFeatureType.MEDIA_PLAYER_CONTROL_ROW),
  controls: optional(array(controlConfigStruct)),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
});
