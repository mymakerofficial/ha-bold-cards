import { MediaControlAction } from "../../helpers/media-player";

export interface MediaPlayerProgressControlFeatureConfig {
  type: "media-player-progress-control";
  controls?: MediaControlAction[];
  full_width?: boolean;
}
