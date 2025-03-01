import { MediaButtonAction } from "./types";
import { MediaPlayerEntity, MediaPlayerRepeat } from "../../types/ha/entity";
import {
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiShuffle,
  mdiShuffleDisabled,
} from "@mdi/js";

export const mediaButtonActionIconMap: {
  [action in MediaButtonAction]: (stateObj?: MediaPlayerEntity) => string;
} = {
  [MediaButtonAction.TURN_ON]: () => "mdi:power",
  [MediaButtonAction.TURN_OFF]: () => "mdi:power",
  [MediaButtonAction.SHUFFLE_SET]: (stateObj) => {
    return !stateObj?.attributes.shuffle
      ? "mdi:shuffle-disabled"
      : "mdi:shuffle";
  },
  [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: () => "mdi:skip-previous",
  [MediaButtonAction.MEDIA_PLAY]: () => "mdi:play",
  [MediaButtonAction.MEDIA_PAUSE]: () => "mdi:pause",
  [MediaButtonAction.MEDIA_NEXT_TRACK]: () => "mdi:skip-next",
  [MediaButtonAction.REPEAT_SET]: (stateObj) => {
    return {
      [MediaPlayerRepeat.OFF]: "mdi:repeat-off",
      [MediaPlayerRepeat.ALL]: "mdi:repeat",
      [MediaPlayerRepeat.ONE]: "mdi:repeat-once",
    }[stateObj?.attributes.repeat ?? MediaPlayerRepeat.OFF];
  },
};
