import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";

export const ControlType = {
  MEDIA_BUTTON: "media_button",
  MEDIA_POSITION: "media_position",
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

export const ElementWhenUnavailable = {
  HIDE: "hide",
  DISABLE: "disable",
} as const;
export type ElementWhenUnavailable =
  (typeof ElementWhenUnavailable)[keyof typeof ElementWhenUnavailable];

export interface BaseButtonControlConfig {
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
  when_unavailable: ElementWhenUnavailable;
}

export interface MediaButtonControlConfig
  extends Partial<BaseButtonControlConfig> {
  type: "media_button";
  action: MediaButtonAction;
  icon?: string;
}

export interface MediaPositionControlConfig {
  type: "media_position";
  timestamp_position?: MediaPositionTimestampPosition;
  when_unavailable?: ElementWhenUnavailable;
}

export interface CustomControlConfig {
  type: "custom";
}

export type ControlConfig =
  | MediaButtonControlConfig
  | MediaPositionControlConfig
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
  // TODO disabled etc.
}

export type ConcreteControl =
  | ConcreteMediaButtonControl
  | ConcreteMediaPositionControl;
