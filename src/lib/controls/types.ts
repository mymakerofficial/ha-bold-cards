import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";
import { mediaToggleKindActionMap } from "./constants";

const _ControlType = {
  MEDIA_BUTTON: "media_button",
  MEDIA_POSITION: "media_position",
  MEDIA_TOGGLE: "media_toggle",
  SPACER: "spacer",
  CUSTOM: "custom",
} as const;
export const ControlType = _ControlType;
export type ControlType = (typeof _ControlType)[keyof typeof _ControlType];
export type ControlTypes = typeof _ControlType;

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
  type: ControlTypes["MEDIA_BUTTON"];
  action: MediaButtonAction;
  always_show?: boolean;
  unavailable_when_off?: boolean;
}

export interface MediaPositionControlConfig {
  type: ControlTypes["MEDIA_POSITION"];
  timestamp_position?: MediaPositionTimestampPosition;
  when_unavailable?: ElementWhenUnavailable;
  unavailable_when_off?: boolean;
}

export interface MediaToggleControlBaseConfig {
  when_unavailable: ElementWhenUnavailable;
  unavailable_when_off?: boolean;
}

export type MediaToggleControlKindConfig<
  TKind extends MediaToggleKind = MediaToggleKind,
> = {
  kind: TKind;
} & {
  [key in (typeof mediaToggleKindActionMap)[TKind][number]]?: Partial<ButtonBaseConfig>;
};

export type MediaToggleControlConfig<
  TKind extends MediaToggleKind = MediaToggleKind,
> = {
  type: ControlTypes["MEDIA_TOGGLE"];
  kind: MediaToggleKind;
} & Partial<MediaToggleControlBaseConfig> &
  MediaToggleControlKindConfig<TKind>;

export interface SpacerControlConfig {
  type: ControlTypes["SPACER"];
}

export interface CustomControlConfig {
  type: ControlTypes["CUSTOM"];
}

export type ControlConfig =
  | MediaButtonControlConfig
  | MediaPositionControlConfig
  | MediaToggleControlConfig
  | SpacerControlConfig
  | CustomControlConfig;

export interface ConcreteMediaButtonControl {
  type: ControlTypes["MEDIA_BUTTON"];
  action: MediaButtonAction;
  icon: string;
  label: string;
  size: ButtonSize;
  shape: ButtonShape;
  variant: ButtonVariant;
  disabled: boolean;
}

export interface ConcreteMediaPositionControl {
  type: ControlTypes["MEDIA_POSITION"];
  timestamp_position: MediaPositionTimestampPosition;
  disabled: boolean;
}

export interface ConcreteSpacerControl {
  type: ControlTypes["SPACER"];
}

export type ConcreteControl =
  | ConcreteMediaButtonControl
  | ConcreteMediaPositionControl
  | ConcreteSpacerControl;
