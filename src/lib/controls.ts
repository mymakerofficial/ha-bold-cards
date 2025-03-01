import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../components/bc-button";
import { MediaControlAction } from "../helpers/media-player";
import {
  assert,
  define,
  enums,
  object,
  optional,
  refine,
  string,
  union,
  validate,
} from "superstruct";
import { StructError } from "superstruct/dist/error";

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

export interface MediaButtonControlConfig extends BaseButtonControlConfig {
  type: "media_button";
  action: MediaControlAction;
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

export const mediaButtonControlConfigStruct = object({
  type: define(
    "type",
    (value) =>
      value === ControlType.MEDIA_BUTTON ||
      `Expected to be "${ControlType.MEDIA_BUTTON}", but received "${value}"`,
  ),
  action: enums(Object.values(MediaControlAction)),
  icon: optional(string()),
  size: optional(enums(Object.values(ButtonSize))),
  shape: optional(enums(Object.values(ButtonShape))),
  variant: optional(enums(Object.values(ButtonVariant))),
});

export const mediaProgressControlConfigStruct = object({
  type: define(
    "type",
    (value) =>
      value === ControlType.MEDIA_PROGRES ||
      `Expected to be "${ControlType.MEDIA_PROGRES}", but received "${value}"`,
  ),
});

export const customControlConfigStruct = object({
  type: define(
    "type",
    (value) =>
      value === ControlType.CUSTOM ||
      `Expected to be "${ControlType.CUSTOM}", but received "${value}"`,
  ),
});

export const controlConfigStruct = define("controlConfig", (value) => {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return `Expected an object containing at least a "type" key, but received "${value}"`;
  }

  switch (value.type) {
    case ControlType.MEDIA_BUTTON:
      try {
        assert(value, mediaButtonControlConfigStruct);
      } catch (e) {
        return (e as StructError).message;
      }
      return true;
    case ControlType.MEDIA_PROGRES:
      try {
        assert(value, mediaProgressControlConfigStruct);
      } catch (e) {
        return (e as StructError).message;
      }
      return true;
    case ControlType.CUSTOM:
      try {
        assert(value, customControlConfigStruct);
      } catch (e) {
        return (e as StructError).message;
      }
      return true;
    default:
      return `Expected "type" to be one of \`${Object.values(ControlType)
        .map((it) => '"' + it + '"')
        .join(", ")}\`, but received "${value.type}"`;
  }
});
