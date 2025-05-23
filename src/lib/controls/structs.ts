import { assign, boolean, enums, object, optional, string } from "superstruct";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "./types";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { exactMatch, typedUnion } from "../struct";
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";
import { mediaToggleKindActionMap } from "./constants";
import { kebabToSnake } from "../helpers";

const buttonBaseConfigStruct = object({
  icon: optional(string()),
  size: optional(enums(Object.values(ButtonSize))),
  shape: optional(enums(Object.values(ButtonShape))),
  variant: optional(enums(Object.values(ButtonVariant))),
});

export const mediaButtonControlConfigStruct = assign(
  buttonBaseConfigStruct,
  object({
    type: exactMatch(ControlType.MEDIA_BUTTON),
    action: enums(Object.values(MediaButtonAction)),
    when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
    always_show: optional(boolean()),
    unavailable_when_off: optional(boolean()),
  }),
);

export const mediaProgressControlConfigStruct = object({
  type: exactMatch(ControlType.MEDIA_POSITION),
  timestamp_position: optional(
    enums(Object.values(MediaPositionTimestampPosition)),
  ),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
  unavailable_when_off: optional(boolean()),
});

const mediaToggleControlBaseConfigStruct = object({
  type: exactMatch(ControlType.MEDIA_TOGGLE),
  when_unavailable: optional(enums(Object.values(ElementWhenUnavailable))),
  unavailable_when_off: optional(boolean()),
});

const spacerControlConfigStruct = object({
  type: exactMatch(ControlType.SPACER),
});

function getMediaToggleControlKindConfigStruct<
  T extends MediaToggleKind,
  K extends MediaButtonAction,
>(kind: T, actions: K[]) {
  return object({
    kind: exactMatch(kind),
    ...Object.fromEntries(
      actions.map((action) => [
        kebabToSnake(action),
        optional(buttonBaseConfigStruct),
      ]),
    ),
  });
}

export const mediaToggleControlConfigStruct = typedUnion({
  name: "mediaToggleKind",
  key: "kind",
  structs: Object.fromEntries(
    Object.entries(mediaToggleKindActionMap).map(([kind, actions]) => [
      kind,
      assign(
        mediaToggleControlBaseConfigStruct,
        getMediaToggleControlKindConfigStruct(kind as MediaToggleKind, actions),
      ),
    ]),
  ),
});

export const customControlConfigStruct = object({
  type: exactMatch(ControlType.CUSTOM),
});

export const controlConfigStruct = typedUnion({
  name: "controlConfig",
  key: "type",
  structs: {
    [ControlType.MEDIA_BUTTON]: mediaButtonControlConfigStruct,
    [ControlType.MEDIA_POSITION]: mediaProgressControlConfigStruct,
    [ControlType.MEDIA_TOGGLE]: mediaToggleControlConfigStruct,
    [ControlType.SPACER]: spacerControlConfigStruct,
    [ControlType.CUSTOM]: customControlConfigStruct,
  },
});
