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
import { MediaPositionTimestampPosition } from "../../components/bc-media-position-control";
import z from "zod";
import { kebabToSnake } from "../helpers";
import { KebabToSnake } from "../types";
import { enums } from "../struct";

const baseButtonConfigStruct = z.object({
  icon: z.string().optional(),
  size: enums(ButtonSize).optional(),
  shape: enums(ButtonShape).optional(),
  variant: enums(ButtonVariant).optional(),
});

export const mediaButtonControlConfigStruct = baseButtonConfigStruct.extend({
  type: z.literal(ControlType.MEDIA_BUTTON),
  action: enums(MediaButtonAction),
  always_show: z.boolean().optional(),
  when_unavailable: enums(ElementWhenUnavailable).optional(),
  unavailable_when_off: z.boolean().optional(),
});

export const mediaProgressControlConfigStruct = z.object({
  type: z.literal(ControlType.MEDIA_POSITION),
  timestamp_position: enums(MediaPositionTimestampPosition).optional(),
  when_unavailable: enums(ElementWhenUnavailable).optional(),
  unavailable_when_off: z.boolean().optional(),
});

const spacerControlConfigStruct = z.object({
  type: z.literal(ControlType.SPACER),
});

function getMediaToggleControlKindConfigStructActionEntries<
  TActions extends MediaButtonAction[],
>(actions: TActions) {
  return Object.fromEntries(
    actions.map((action) => [
      kebabToSnake(action),
      baseButtonConfigStruct.optional(),
    ]),
  ) as Record<
    KebabToSnake<TActions[number]>,
    z.ZodOptional<typeof baseButtonConfigStruct>
  >;
}

const baseMediaToggleControlConfigStruct = z.object({
  type: z.literal(ControlType.MEDIA_TOGGLE),
  kind: enums(MediaToggleKind),
  when_unavailable: enums(ElementWhenUnavailable).optional(),
  unavailable_when_off: z.boolean().optional(),
});

function getMediaToggleControlKindConfigStruct<
  TKind extends MediaToggleKind,
  TActions extends MediaButtonAction,
>(kind: TKind, actions: TActions[]) {
  return baseMediaToggleControlConfigStruct.extend({
    kind: z.literal(kind),
    ...getMediaToggleControlKindConfigStructActionEntries(actions),
  });
}

export const mediaToggleControlConfigStruct = z.discriminatedUnion("kind", [
  getMediaToggleControlKindConfigStruct(MediaToggleKind.PLAY_PAUSE, [
    MediaButtonAction.MEDIA_PLAY,
    MediaButtonAction.MEDIA_PAUSE,
  ]),
  getMediaToggleControlKindConfigStruct(MediaToggleKind.ON_OFF, [
    MediaButtonAction.TURN_ON,
    MediaButtonAction.TURN_OFF,
  ]),
]);

export const controlConfigStruct = z
  .discriminatedUnion("type", [
    mediaButtonControlConfigStruct,
    mediaProgressControlConfigStruct,
    spacerControlConfigStruct,
  ])
  .or(mediaToggleControlConfigStruct);
