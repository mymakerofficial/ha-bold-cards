import {
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaButtonControlBaseConfig,
  MediaToggleControlBaseConfig,
  MediaToggleKind,
} from "./types";
import { MediaPlayerEntity, MediaPlayerRepeat } from "../../types/ha/entity";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";
import { DefaultConfigMap, DefaultConfigType } from "../types";

export type MediaButtonControlDefaultMap = {
  [action in MediaButtonAction]: MediaButtonControlBaseConfig;
};

const mediaButtonControlDefaultMapDefault: MediaButtonControlDefaultMap = {
  [MediaButtonAction.TURN_ON]: {
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  },
  [MediaButtonAction.TURN_OFF]: {
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  },
  [MediaButtonAction.SHUFFLE_SET]: {
    size: ButtonSize.SM,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  },
  [MediaButtonAction.MEDIA_PREVIOUS_TRACK]: {
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  },
  [MediaButtonAction.MEDIA_PLAY]: {
    size: ButtonSize.XL,
    shape: ButtonShape.ROUND,
    variant: ButtonVariant.FILLED,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  },
  [MediaButtonAction.MEDIA_PAUSE]: {
    size: ButtonSize.XL,
    shape: ButtonShape.SQUARE_WIDE,
    variant: ButtonVariant.FILLED,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  },
  [MediaButtonAction.MEDIA_NEXT_TRACK]: {
    size: ButtonSize.MD,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.DISABLE,
  },
  [MediaButtonAction.REPEAT_SET]: {
    size: ButtonSize.SM,
    shape: ButtonShape.SQUARE,
    variant: ButtonVariant.PLAIN,
    when_unavailable: ElementWhenUnavailable.HIDE,
  },
};

export const mediaButtonControlDefaultMaps: DefaultConfigMap<MediaButtonControlDefaultMap> =
  {
    [DefaultConfigType.DEFAULT]: mediaButtonControlDefaultMapDefault,
    [DefaultConfigType.INLINED]: {
      ...mediaButtonControlDefaultMapDefault,
      [MediaButtonAction.MEDIA_PLAY]: {
        size: ButtonSize.MD,
        shape: ButtonShape.ROUND,
        variant: ButtonVariant.FILLED,
        when_unavailable: ElementWhenUnavailable.DISABLE,
      },
      [MediaButtonAction.MEDIA_PAUSE]: {
        size: ButtonSize.MD,
        shape: ButtonShape.SQUARE,
        variant: ButtonVariant.FILLED,
        when_unavailable: ElementWhenUnavailable.DISABLE,
      },
    },
    [DefaultConfigType.EXTERNAL]: Object.fromEntries(
      Object.entries(mediaButtonControlDefaultMapDefault).map(
        ([key, value]) => [
          key,
          {
            ...value,
            size: ButtonSize.SM,
            shape: ButtonShape.SQUARE,
          },
        ],
      ),
    ) as MediaButtonControlDefaultMap,
  } as const;

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

export const mediaToggleKindIconMap: {
  [kind in MediaToggleKind]: string;
} = {
  [MediaToggleKind.PLAY_PAUSE]: "mdi:play-pause",
  [MediaToggleKind.ON_OFF]: "mdi:power",
};

export const mediaToggleKindActionMap = {
  [MediaToggleKind.PLAY_PAUSE]: [
    MediaButtonAction.MEDIA_PLAY,
    MediaButtonAction.MEDIA_PAUSE,
  ],
  [MediaToggleKind.ON_OFF]: [
    MediaButtonAction.TURN_ON,
    MediaButtonAction.TURN_OFF,
  ],
} as const satisfies {
  [kind in MediaToggleKind]: MediaButtonAction[];
};

export const mediaToggleDefaultMap: {
  [kind in MediaToggleKind]: MediaToggleControlBaseConfig;
} = {
  [MediaToggleKind.PLAY_PAUSE]: {
    when_unavailable: ElementWhenUnavailable.DISABLE,
  },
  [MediaToggleKind.ON_OFF]: {
    when_unavailable: ElementWhenUnavailable.HIDE,
  },
};
