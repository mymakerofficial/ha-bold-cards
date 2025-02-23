import {
  MediaContentType,
  MediaPlayerEntity,
  MediaPlayerState,
} from "../types/ha/entity";
import { isStateOff, isStateUnavailable } from "./states";
import { supportsFeature } from "./supports-feature";
import {
  mdiPause,
  mdiPlay,
  mdiPower,
  mdiRepeat,
  mdiShuffle,
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

export function getMediaDescription(stateObj: MediaPlayerEntity) {
  switch (stateObj.attributes.media_content_type) {
    case MediaContentType.MUSIC:
    case MediaContentType.IMAGE:
    case MediaContentType.VIDEO:
      return (
        stateObj.attributes.media_artist ?? stateObj.attributes.app_name ?? ""
      );
    // TODO handle other cases
    default:
      return stateObj.attributes.app_name ?? "";
  }
}

export const MediaControlAction = {
  TURN_ON: "turn_on",
  TURN_OFF: "turn_off",
  SHUFFLE_SET: "shuffle_set",
  MEDIA_PREVIOUS_TRACK: "media_previous_track",
  MEDIA_PLAY: "media_play",
  MEDIA_PAUSE: "media_pause",
  MEDIA_NEXT_TRACK: "media_next_track",
  REPEAT_SET: "repeat_set",
};
export type MediaControlAction =
  (typeof MediaControlAction)[keyof typeof MediaControlAction];

export interface MediaControlButton {
  iconPath: string;
  action: MediaControlAction;
}

export function getMediaControls(stateObj: MediaPlayerEntity) {
  const { state } = stateObj;

  if (isStateUnavailable(stateObj.state)) {
    return [];
  }

  const buttons: MediaControlButton[] = [];

  if (
    isStateOff(state) &&
    supportsFeature(stateObj, MediaPlayerEntityFeature.TURN_ON)
  ) {
    buttons.push({
      iconPath: mdiPower,
      action: MediaControlAction.TURN_ON,
    });
  }

  if (
    !isStateOff(state) &&
    supportsFeature(stateObj, MediaPlayerEntityFeature.TURN_OFF)
  ) {
    buttons.push({
      iconPath: mdiPower,
      action: MediaControlAction.TURN_OFF,
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.SHUFFLE_SET)) {
    buttons.push({
      iconPath: mdiShuffle,
      action: MediaControlAction.SHUFFLE_SET,
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.PREVIOUS_TRACK)) {
    buttons.push({
      iconPath: mdiSkipPrevious,
      action: MediaControlAction.MEDIA_PREVIOUS_TRACK,
    });
  }

  if (
    state !== MediaPlayerState.PLAYING &&
    supportsFeature(stateObj, MediaPlayerEntityFeature.PLAY)
  ) {
    buttons.push({
      iconPath: mdiPlay,
      action: MediaControlAction.MEDIA_PLAY,
    });
  }

  if (
    state !== MediaPlayerState.PAUSED &&
    supportsFeature(stateObj, MediaPlayerEntityFeature.PAUSE)
  ) {
    buttons.push({
      iconPath: mdiPause,
      action: MediaControlAction.MEDIA_PAUSE,
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.NEXT_TRACK)) {
    buttons.push({
      iconPath: mdiSkipNext,
      action: MediaControlAction.MEDIA_NEXT_TRACK,
    });
  }

  if (supportsFeature(stateObj, MediaPlayerEntityFeature.REPEAT_SET)) {
    buttons.push({
      iconPath: mdiRepeat,
      action: MediaControlAction.REPEAT_SET,
    });
  }

  return buttons;
}
