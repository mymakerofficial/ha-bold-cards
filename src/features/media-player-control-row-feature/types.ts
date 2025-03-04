import {
  ControlConfig,
  ElementWhenUnavailable,
} from "../../lib/controls/types";

export interface BoldMediaPlayerControlRowFeatureConfig {
  type: "custom:bold-media-player-control-row";
  controls?: ControlConfig[];
  when_unavailable?: ElementWhenUnavailable;
}
