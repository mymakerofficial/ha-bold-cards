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
import { z } from "zod/v4";
import { kebabToSnake } from "../helpers";
import { KebabToSnake } from "../types";

const baseButtonConfigStruct = z.object({
  icon: z.string().optional(),
  size: z.enum(ButtonSize).optional(),
  shape: z.enum(ButtonShape).optional(),
  variant: z.enum(ButtonVariant).optional(),
});

export const mediaButtonControlConfigStruct = baseButtonConfigStruct.extend({
  type: z.literal(ControlType.MEDIA_BUTTON),
  action: z.enum(MediaButtonAction),
  always_show: z.boolean().optional(),
  when_unavailable: z.enum(ElementWhenUnavailable).optional(),
  unavailable_when_off: z.boolean().optional(),
});

export const mediaProgressControlConfigStruct = z.object({
  type: z.literal(ControlType.MEDIA_POSITION),
  timestamp_position: z.enum(MediaPositionTimestampPosition).optional(),
  when_unavailable: z.enum(ElementWhenUnavailable).optional(),
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

function getMediaToggleControlKindConfigStruct<
  TKind extends MediaToggleKind,
  TActions extends MediaButtonAction,
>(kind: TKind, actions: TActions[]) {
  return z.object({
    type: z.literal(ControlType.MEDIA_TOGGLE),
    kind: z.literal(kind),
    ...getMediaToggleControlKindConfigStructActionEntries(actions),
    when_unavailable: z.enum(ElementWhenUnavailable).optional(),
    unavailable_when_off: z.boolean().optional(),
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

export const controlConfigStruct = z.discriminatedUnion("type", [
  mediaButtonControlConfigStruct,
  mediaProgressControlConfigStruct,
  mediaToggleControlConfigStruct,
  spacerControlConfigStruct,
]);
