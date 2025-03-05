import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";

export const ControlType = {
  MEDIA_BUTTON: "media_button",
  MEDIA_POSITION: "media_position",
  MEDIA_TOGGLE: "media_toggle",
  CUSTOM: "custom",
} as const;
export type ControlType = (typeof ControlType)[keyof typeof ControlType];

export const MediaButtonAction = {
  MEDIA_PREVIOUS_TRACK: "media_previous_track",
  MEDIA_NEXT_TRACK: "media_next_track",
  SHUFFLE_SET: "shuffle_set",
  REPEAT_SET: "repeat_set",
  MEDIA_PLAY: "media_play",
  MEDIA_PAUSE: "media_pause",
  TURN_ON: "turn_on",
  TURN_OFF: "turn_off",
} as const;
export type MediaButtonAction =
  (typeof MediaButtonAction)[keyof typeof MediaButtonAction];

export const MediaToggleKind = {
  PLAY_PAUSE: "play_pause",
  ON_OFF: "on_off",
} as const;
export type MediaToggleKind =
  (typeof MediaToggleKind)[keyof typeof MediaToggleKind];

export const ElementWhenUnavailable = {
  HIDE: "hide",
  DISABLE: "disable",
} as const;
export type ElementWhenUnavailable =
  (typeof ElementWhenUnavailable)[keyof typeof ElementWhenUnavailable];

export interface ButtonBaseConfig {
  icon?: string;
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
}

export interface MediaButtonControlBaseConfig {
  icon?: string;
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
  when_unavailable: ElementWhenUnavailable;
}

export interface MediaButtonControlConfig
  extends Partial<MediaButtonControlBaseConfig> {
  type: "media_button";
  action: MediaButtonAction;
  always_show?: boolean;
}

export interface MediaPositionControlConfig {
  type: "media_position";
  timestamp_position?: MediaPositionTimestampPosition;
  when_unavailable?: ElementWhenUnavailable;
}

export interface MediaToggleControlBaseConfig {
  when_unavailable: ElementWhenUnavailable;
}

export type MediaToggleControlConfig = {
  type: "media_toggle";
  kind: MediaToggleKind;
} & Partial<MediaToggleControlBaseConfig> & {
    [key in MediaButtonAction]?: Partial<ButtonBaseConfig>;
  };

export interface CustomControlConfig {
  type: "custom";
}

export type ControlConfig =
  | MediaButtonControlConfig
  | MediaPositionControlConfig
  | MediaToggleControlConfig
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

export interface ConcreteMediaPositionControl {
  type: "media_position";
  timestamp_position: MediaPositionTimestampPosition;
  disabled: boolean;
}

export type ConcreteControl =
  | ConcreteMediaButtonControl
  | ConcreteMediaPositionControl;
