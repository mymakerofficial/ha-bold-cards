import { ControlConfig } from "../../lib/controls";

export interface MediaPlayerProgressControlFeatureConfig {
  type: "custom:media-player-progress-control";
  controls?: ControlConfig[];
  full_width?: boolean;
  show_timestamps?: boolean;
}
