import { assert, define, enums, object, optional, string } from "superstruct";
import { ControlType, MediaButtonAction } from "./types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { StructError } from "superstruct/dist/error";

export const mediaButtonControlConfigStruct = object({
  type: define(
    "type",
    (value) =>
      value === ControlType.MEDIA_BUTTON ||
      `Expected to be "${ControlType.MEDIA_BUTTON}", but received "${value}"`,
  ),
  action: enums(Object.values(MediaButtonAction)),
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
