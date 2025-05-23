import {
  mediaButtonActionIconMap,
  mediaButtonControlDefaultMaps,
  mediaToggleDefaultMap,
  mediaToggleKindActionMap,
  mediaToggleKindIconMap,
} from "./constants";
import {
  ConcreteControl,
  ConcreteMediaButtonControl,
  ControlConfig,
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaButtonControlBaseConfig,
  MediaButtonControlConfig,
  MediaToggleControlBaseConfig,
  MediaToggleControlConfig,
  MediaToggleKind,
} from "./types";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { t } from "../../localization/i18n";
import {
  getMediaButtonActionAvailability,
  MediaPlayerEntityFeature,
} from "../../helpers/media-player";
import { supportsFeature } from "../../helpers/supports-feature";
import { DefaultConfigType } from "../types";
import { isMediaPlayerStateActive } from "../../helpers/states";
import { kebabToSnake } from "../helpers";

export function getControlIcon(
  control: ControlConfig,
  stateObj?: HassEntityBase,
) {
  switch (control.type) {
    case ControlType.MEDIA_BUTTON:
      return (
        control.icon ??
        mediaButtonActionIconMap[control.action](stateObj as MediaPlayerEntity)
      );
    case ControlType.MEDIA_POSITION:
      return "mdi:ray-vertex";
    case ControlType.MEDIA_TOGGLE:
      return mediaToggleKindIconMap[control.kind];
    case ControlType.SPACER:
      return "mdi:keyboard-space";
    default:
      return "";
  }
}

export function getControlLabel(control: ControlConfig) {
  switch (control.type) {
    case ControlType.MEDIA_BUTTON:
      return t(control.action, {
        scope: "common.media_button_action",
      });
    case ControlType.MEDIA_TOGGLE:
      return t(control.kind, {
        scope: "common.media_toggle_kind",
      });
    default:
      return t(control.type, {
        scope: "common.control_type",
      });
  }
}

export function getControlKey(control: ControlConfig) {
  switch (control.type) {
    case ControlType.MEDIA_BUTTON:
      return control.type + control.action;
    case ControlType.MEDIA_TOGGLE:
      return control.type + control.kind;
    default:
      return control.type;
  }
}

type ControlTranslationProps<T = ControlConfig> = {
  controls?: T[];
  stateObj?: HassEntityBase;
  defaultType?: DefaultConfigType;
};

type ControlSingleTranslationProps<T = ControlConfig> = {
  control: T;
  stateObj?: HassEntityBase;
  defaultType?: DefaultConfigType;
} & Omit<ControlTranslationProps, "controls">;

export function getMediaButtonControlDefaultConfig(
  action: MediaButtonAction,
  defaultType: DefaultConfigType,
): MediaButtonControlBaseConfig {
  return mediaButtonControlDefaultMaps[defaultType][action];
}

export function getMediaToggleControlDefaultConfig(
  kind: MediaToggleKind,
): MediaToggleControlBaseConfig {
  return mediaToggleDefaultMap[kind];
}

function translateMediaButtonControl({
  control,
  stateObj,
  defaultType = DefaultConfigType.DEFAULT,
}: ControlSingleTranslationProps<MediaButtonControlConfig>):
  | ConcreteMediaButtonControl
  | undefined {
  const config = {
    ...getMediaButtonControlDefaultConfig(control.action, defaultType),
    ...control,
  };

  const mediaButtonActionAvailability = getMediaButtonActionAvailability(
    stateObj as MediaPlayerEntity,
  );

  const { supported, applicable } =
    mediaButtonActionAvailability[control.action];

  const playerIsActive = isMediaPlayerStateActive(stateObj?.state ?? "");

  const unavailableBecauseInactive =
    (!playerIsActive && config.unavailable_when_off) ?? false;

  if (!applicable && !config.always_show) {
    // the action is available but should not be shown because of the state
    return undefined;
  }

  const unavailable = !supported || unavailableBecauseInactive;

  if (unavailable && config.when_unavailable === ElementWhenUnavailable.HIDE) {
    // the action is unavailable and the user has requested to hide it
    return undefined;
  }

  return {
    type: ControlType.MEDIA_BUTTON,
    action: control.action,
    icon: getControlIcon(config, stateObj),
    label: getControlLabel(config),
    size: config.size,
    shape: config.shape,
    variant: config.variant,
    disabled: unavailable,
  } as ConcreteMediaButtonControl;
}

function translateMediaToggleControl({
  control,
  ...props
}: ControlSingleTranslationProps<MediaToggleControlConfig>) {
  const defaultConfig = getMediaToggleControlDefaultConfig(control.kind);

  return mediaToggleKindActionMap[control.kind].map((action) => {
    const buttonConfig = mediaToggleActionToMediaButtonControlConfig(
      control,
      action,
    );

    console.log("translateMediaToggleControl", buttonConfig);

    return translateMediaButtonControl({
      control: {
        ...buttonConfig,
        when_unavailable:
          control.when_unavailable ?? defaultConfig.when_unavailable,
        unavailable_when_off: control.unavailable_when_off,
      },
      ...props,
    });
  });
}

export function mediaToggleActionToMediaButtonControlConfig(
  config: MediaToggleControlConfig,
  action: MediaButtonAction,
): MediaButtonControlConfig {
  return {
    type: ControlType.MEDIA_BUTTON,
    action,
    ...(config[kebabToSnake(action)] ?? {}),
  };
}

export function translateControls({
  controls,
  stateObj,
  defaultType = DefaultConfigType.DEFAULT,
}: ControlTranslationProps): ConcreteControl[] {
  if (!controls) {
    return [];
  }

  return controls
    .flatMap((control) => {
      switch (control.type) {
        case ControlType.MEDIA_BUTTON:
          return translateMediaButtonControl({
            control,
            stateObj,
            defaultType,
          });
        case ControlType.MEDIA_TOGGLE:
          return translateMediaToggleControl({
            control,
            stateObj,
            defaultType,
          });
        case ControlType.MEDIA_POSITION:
          const supportsSeek = stateObj
            ? supportsFeature(
                stateObj as MediaPlayerEntity,
                MediaPlayerEntityFeature.SEEK,
              )
            : false;

          const playerIsActive = isMediaPlayerStateActive(
            stateObj?.state ?? "",
          );
          const unavailableBecauseInactive =
            (!playerIsActive && control.unavailable_when_off) ?? false;

          const unsupported = !supportsSeek || unavailableBecauseInactive;

          if (
            unsupported &&
            control.when_unavailable === ElementWhenUnavailable.HIDE
          ) {
            return undefined;
          }

          return {
            type: ControlType.MEDIA_POSITION,
            timestamp_position: control.timestamp_position,
            disabled: unsupported,
          };
        case ControlType.SPACER:
          return {
            type: ControlType.SPACER,
          };
        default:
          return undefined;
      }
    })
    .filter((control) => control !== undefined) as ConcreteControl[];
}
