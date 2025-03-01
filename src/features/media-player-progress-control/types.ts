import {
  ControlConfig,
  ElementWhenUnavailable,
} from "../../lib/controls/types";

export interface MediaPlayerProgressControlFeatureConfig {
  type: "custom:media-player-progress-control";
  controls?: ControlConfig[];
  full_width?: boolean;
  show_timestamps?: boolean;
  when_unavailable?: ElementWhenUnavailable;
}
