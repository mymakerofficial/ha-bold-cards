import {
  assert,
  boolean,
  define,
  enums,
  object,
  optional,
  string,
} from "superstruct";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
} from "./types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { StructError } from "superstruct/dist/error";
import { exactMatch } from "../struct";
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";

export const mediaButtonControlConfigStruct = object({
  type: exactMatch(ControlType.MEDIA_BUTTON),
  action: enums(Object.values(MediaButtonAction)),
  icon: optional(string()),
  size: optional(enums(Object.values(ButtonSize))),
  shape: optional(enums(Object.values(ButtonShape))),
  variant: optional(enums(Object.values(ButtonVariant))),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
  always_show: optional(boolean()),
});

export const mediaProgressControlConfigStruct = object({
  type: exactMatch(ControlType.MEDIA_POSITION),
  timestamp_position: optional(
    enums(Object.values(MediaPositionTimestampPosition)),
  ),
});

export const customControlConfigStruct = object({
  type: exactMatch(ControlType.CUSTOM),
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
    case ControlType.MEDIA_POSITION:
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
