import { MediaControlAction } from "../../helpers/media-player";

export interface MediaPlayerProgressControlFeatureConfig {
  type: "custom:media-player-progress-control";
  controls?: MediaControlAction[];
  full_width?: boolean;
  show_timestamps?: boolean;
}
