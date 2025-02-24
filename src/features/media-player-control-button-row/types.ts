import { MediaControlAction } from "../../helpers/media-player";

export interface MediaPlayerControlButtonRowFeatureConfig {
  type: "custom:media-player-control-button-row";
  controls?: MediaControlAction[];
  // TODO: find something better! maybe an enum for style?
  small?: boolean;
}
