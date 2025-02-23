import { MediaPlayerEntity } from "../types/ha/entity";
import { isStateActive, isStateUnavailable } from "./states";
import { supportsFeature } from "./supports-feature";
import {
  mdiPause,
  mdiPlay,
  mdiPower,
  mdiSkipNext,
  mdiSkipPrevious,
} from "@mdi/js";

export const MediaPlayerEntityFeature = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,

  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY_MEDIA: 512,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  CLEAR_PLAYLIST: 8192,
  PLAY: 16384,
  SHUFFLE_SET: 32768,
  SELECT_SOUND_MODE: 65536,
  BROWSE_MEDIA: 131072,
  REPEAT_SET: 262144,
  GROUPING: 524288,
} as const;
export type MediaPlayerEntityFeature =
  (typeof MediaPlayerEntityFeature)[keyof typeof MediaPlayerEntityFeature];

export interface MediaControlButton {
  iconPath: string;
  action: string;
}

export function getMediaControls(stateObj: MediaPlayerEntity) {
  if (isStateUnavailable(stateObj.state)) {
    return;
  }

  if (!isStateActive(stateObj)) {
    return;
  }

  const buttons: MediaControlButton[] = [];

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.TURN_OFF)) {
    buttons.push({
      iconPath: mdiPower,
      action: "turn_off",
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.PREVIOUS_TRACK)) {
    buttons.push({
      iconPath: mdiSkipPrevious,
      action: "media_previous_track",
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.PLAY)) {
    buttons.push({
      iconPath: mdiPlay,
      action: "media_play",
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.PAUSE)) {
    buttons.push({
      iconPath: mdiPause,
      action: "media_pause",
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.NEXT_TRACK)) {
    buttons.push({
      iconPath: mdiSkipNext,
      action: "media_next_track",
    });
  }

  return buttons;
}
