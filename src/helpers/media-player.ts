import {
  MediaContentType,
  MediaPlayerEntity,
  MediaPlayerRepeat,
  MediaPlayerState,
} from "../types/ha/entity";
import { isStateOff, isStateUnavailable } from "./states";
import { supportsFeature } from "./supports-feature";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../components/bc-button";
import { HomeAssistant } from "../types/ha/lovelace";
import { MediaButtonAction } from "../lib/controls/types";

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

export interface MediaControlButton {
  iconPath: string;
  action: MediaButtonAction;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
}

export interface MediaButtonActionAvailability {
  // this feature is supported by the media player
  available: boolean;
  // when false the button should always be hidden
  //  because the current state makes the action redundant (e.g. play button when already playing)
  applicable: boolean;
}

export function getMediaButtonActionAvailability(stateObj: MediaPlayerEntity) {
  const { state } = stateObj;

  const buttons: {
    [key in MediaButtonAction]: MediaButtonActionAvailability;
  } = Object.values(MediaButtonAction).reduce((acc, action) => {
    acc[action] = { available: false, applicable: true };
    return acc;
  }, {} as any);

  if (isStateUnavailable(stateObj.state)) {
    return buttons;
  }

  // TURN_ON
  buttons[MediaButtonAction.TURN_ON] = {
    available: supportsFeature(stateObj, MediaPlayerEntityFeature.TURN_ON),
    applicable: isStateOff(state),
  };

  // TURN_OFF
  buttons[MediaButtonAction.TURN_OFF] = {
    available: supportsFeature(stateObj, MediaPlayerEntityFeature.TURN_OFF),
    applicable: !isStateOff(state),
  };

  // MEDIA_PLAY
  buttons[MediaButtonAction.MEDIA_PLAY] = {
    available: supportsFeature(stateObj, MediaPlayerEntityFeature.PLAY),
    applicable: state !== MediaPlayerState.PLAYING,
  };

  // MEDIA_PAUSE
  buttons[MediaButtonAction.MEDIA_PAUSE] = {
    available: supportsFeature(stateObj, MediaPlayerEntityFeature.PAUSE),
    applicable: state === MediaPlayerState.PLAYING,
  };

  // MEDIA_PREVIOUS_TRACK
  buttons[MediaButtonAction.MEDIA_PREVIOUS_TRACK].available = supportsFeature(
    stateObj,
    MediaPlayerEntityFeature.PREVIOUS_TRACK,
  );

  // MEDIA_NEXT_TRACK
  buttons[MediaButtonAction.MEDIA_NEXT_TRACK].available = supportsFeature(
    stateObj,
    MediaPlayerEntityFeature.NEXT_TRACK,
  );

  // SHUFFLE_SET
  buttons[MediaButtonAction.SHUFFLE_SET].available = supportsFeature(
    stateObj,
    MediaPlayerEntityFeature.SHUFFLE_SET,
  );

  // REPEAT_SET
  buttons[MediaButtonAction.REPEAT_SET].available = supportsFeature(
    stateObj,
    MediaPlayerEntityFeature.REPEAT_SET,
  );

  return buttons;
}

export async function handleMediaPlayerAction({
  hass,
  stateObj,
  action,
}: {
  hass: HomeAssistant;
  stateObj: MediaPlayerEntity;
  action: MediaButtonAction;
}) {
  await hass.callService(
    "media_player",
    action,
    getMediaPlayerActionServiceData(stateObj, action),
  );
}

function getMediaPlayerActionServiceData(
  stateObj: MediaPlayerEntity,
  action: MediaButtonAction,
) {
  switch (action) {
    case MediaButtonAction.SHUFFLE_SET:
      return {
        entity_id: stateObj.entity_id,
        shuffle: !stateObj.attributes.shuffle,
      };
    case MediaButtonAction.REPEAT_SET:
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
