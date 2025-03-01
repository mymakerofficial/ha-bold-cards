import {
  BaseButtonControlConfig,
  MediaButtonAction,
  ElementWhenUnavailable,
} from "./types";
import { MediaPlayerEntity, MediaPlayerRepeat } from "../../types/ha/entity";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";

export const mediaButtonDefaultMap: {
  [action in MediaButtonAction]: (
    stateObj?: MediaPlayerEntity,
  ) => BaseButtonControlConfig;
} = {
  [MediaButtonAction.TURN_ON]: () => ({
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  }),
  [MediaButtonAction.TURN_OFF]: () => ({
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  }),
  [MediaButtonAction.SHUFFLE_SET]: () => ({
    size: ButtonSize.SM,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  }),
  [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: () => ({
    size: ButtonSize.LG,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  }),
  [MediaButtonAction.MEDIA_PLAY]: () => ({
    size: ButtonSize.XL,
    shape: ButtonShape.ROUNDED,
    variant: ButtonVariant.FILLED,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  }),
  [MediaButtonAction.MEDIA_PAUSE]: () => ({
    size: ButtonSize.XL,
    shape: ButtonShape.WIDE,
    variant: ButtonVariant.FILLED,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  }),
  [MediaButtonAction.MEDIA_NEXT_TRACK]: () => ({
    size: ButtonSize.LG,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  }),
  [MediaButtonAction.REPEAT_SET]: () => ({
    size: ButtonSize.SM,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  }),
};

export const mediaButtonActionIconMap: {
  [action in MediaButtonAction]: (stateObj?: MediaPlayerEntity) => string;
} = {
  [MediaButtonAction.TURN_ON]: () => "mdi:power",
  [MediaButtonAction.TURN_OFF]: () => "mdi:power",
  [MediaButtonAction.SHUFFLE_SET]: (stateObj) => {
    return !stateObj?.attributes.shuffle
      ? "mdi:shuffle-disabled"
      : "mdi:shuffle";
  },
  [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: () => "mdi:skip-previous",
  [MediaButtonAction.MEDIA_PLAY]: () => "mdi:play",
  [MediaButtonAction.MEDIA_PAUSE]: () => "mdi:pause",
  [MediaButtonAction.MEDIA_NEXT_TRACK]: () => "mdi:skip-next",
  [MediaButtonAction.REPEAT_SET]: (stateObj) => {
    return {
      [MediaPlayerRepeat.OFF]: "mdi:repeat-off",
      [MediaPlayerRepeat.ALL]: "mdi:repeat",
      [MediaPlayerRepeat.ONE]: "mdi:repeat-once",
    }[stateObj?.attributes.repeat ?? MediaPlayerRepeat.OFF];
  },
};
