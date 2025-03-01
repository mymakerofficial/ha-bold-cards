import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";

export const ControlType = {
  MEDIA_BUTTON: "media_button",
  MEDIA_PROGRES: "media_progress",
  CUSTOM: "custom",
} as const;
export type ControlType = (typeof ControlType)[keyof typeof ControlType];

interface BaseButtonControlConfig {
  icon?: string;
  size?: ButtonSize;
  shape?: ButtonShape;
  variant?: ButtonVariant;
}

export const MediaButtonAction = {
  TURN_ON: "turn_on",
  TURN_OFF: "turn_off",
  SHUFFLE_SET: "shuffle_set",
  MEDIA_PREVIOUS_TRACK: "media_previous_track",
  MEDIA_PLAY: "media_play",
  MEDIA_PAUSE: "media_pause",
  MEDIA_NEXT_TRACK: "media_next_track",
  REPEAT_SET: "repeat_set",
};
export type MediaButtonAction =
  (typeof MediaButtonAction)[keyof typeof MediaButtonAction];

export interface MediaButtonControlConfig extends BaseButtonControlConfig {
  type: "media_button";
  action: MediaButtonAction;
}

export interface MediaProgressControlConfig {
  type: "media_progress";
}

export interface CustomControlConfig {
  type: "custom";
}

export type ControlConfig =
  | MediaButtonControlConfig
  | MediaProgressControlConfig
  | CustomControlConfig;
