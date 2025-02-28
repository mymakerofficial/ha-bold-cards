import {
  MediaContentType,
  MediaPlayerEntity,
  MediaPlayerRepeat,
  MediaPlayerState,
} from "../types/ha/entity";
import { isStateOff, isStateUnavailable } from "./states";
import { supportsFeature } from "./supports-feature";
import {
  mdiPause,
  mdiPlay,
  mdiPower,
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiShuffle,
  mdiShuffleDisabled,
  mdiSkipNext,
  mdiSkipPrevious,
} from "@mdi/js";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../components/bc-button";
import { HomeAssistant } from "../types/ha/lovelace";

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
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
}

export function getMediaControls(
  stateObj: MediaPlayerEntity,
  // TODO only temporary
  largePlayButton = false,
) {
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
      iconPath: stateObj.attributes.shuffle ? mdiShuffle : mdiShuffleDisabled,
      action: MediaControlAction.SHUFFLE_SET,
      size: ButtonSize.SM,
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
      variant: ButtonVariant.FILLED,
      size: largePlayButton ? ButtonSize.XL : ButtonSize.MD,
      shape: ButtonShape.ROUNDED,
    });
  }

  if (
    state === MediaPlayerState.PLAYING &&
    supportsFeature(stateObj, MediaPlayerEntityFeature.PAUSE)
  ) {
    buttons.push({
      iconPath: mdiPause,
      action: MediaControlAction.MEDIA_PAUSE,
      variant: ButtonVariant.FILLED,
      size: largePlayButton ? ButtonSize.XL : ButtonSize.MD,
      shape: largePlayButton ? ButtonShape.WIDE : ButtonShape.SQUARE,
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
      iconPath: {
        [MediaPlayerRepeat.OFF]: mdiRepeatOff,
        [MediaPlayerRepeat.ALL]: mdiRepeat,
        [MediaPlayerRepeat.ONE]: mdiRepeatOnce,
      }[stateObj.attributes.repeat ?? MediaPlayerRepeat.OFF],
      action: MediaControlAction.REPEAT_SET,
      size: ButtonSize.SM,
    });
  }

  return buttons;
}

export async function handleMediaPlayerAction({
  hass,
  stateObj,
  action,
}: {
  hass: HomeAssistant;
  stateObj: MediaPlayerEntity;
  action: MediaControlAction;
}) {
  await hass.callService(
    "media_player",
    action,
    getMediaPlayerActionServiceData(stateObj, action),
  );
}

function getMediaPlayerActionServiceData(
  stateObj: MediaPlayerEntity,
  action: MediaControlAction,
) {
  switch (action) {
    case MediaControlAction.SHUFFLE_SET:
      return {
        entity_id: stateObj.entity_id,
        shuffle: !stateObj.attributes.shuffle,
      };
    case MediaControlAction.REPEAT_SET:
      return {
        entity_id: stateObj.entity_id,
        repeat: getNextRepeatMode(stateObj.attributes.repeat),
      };
    default:
      return {
        entity_id: stateObj.entity_id,
      };
  }
}

function getNextRepeatMode(
  currentMode: MediaPlayerRepeat = MediaPlayerRepeat.OFF,
) {
  const values = Object.values(MediaPlayerRepeat);
  return values[(values.indexOf(currentMode) + 1) % values.length];
}
