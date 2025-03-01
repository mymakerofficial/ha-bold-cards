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

export const MediaButtonWhenUnavailable = {
  HIDE: "hide",
  DISABLE: "disable",
} as const;
export type MediaButtonWhenUnavailable =
  (typeof MediaButtonWhenUnavailable)[keyof typeof MediaButtonWhenUnavailable];

export interface BaseButtonControlConfig {
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
  when_unavailable: MediaButtonWhenUnavailable;
}

export interface MediaButtonControlConfig
  extends Partial<BaseButtonControlConfig> {
  type: "media_button";
  action: MediaButtonAction;
  icon?: string;
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

export interface ConcreteMediaButtonControl {
  type: "media_button";
  action: MediaButtonAction;
  icon: string;
  label: string;
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
  disabled: boolean;
}

export type ConcreteControl = ConcreteMediaButtonControl;
