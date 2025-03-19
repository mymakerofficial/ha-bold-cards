import {
  ControlConfig,
  ElementWhenUnavailable,
} from "../../lib/controls/types";
import { BoldFeatureTypes } from "../../lib/features/types";

export interface BoldMediaPlayerControlRowFeatureConfig {
  type: BoldFeatureTypes["MEDIA_PLAYER_CONTROL_ROW"];
  controls?: ControlConfig[];
  when_unavailable?: ElementWhenUnavailable;
}
