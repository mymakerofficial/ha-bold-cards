import {
  mediaButtonActionIconMap,
  mediaButtonDefaultMap,
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
} from "./types";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { t } from "../../localization/i18n";
import {
  getMediaButtonActionAvailability,
  MediaPlayerEntityFeature,
} from "../../helpers/media-player";
import { supportsFeature } from "../../helpers/supports-feature";

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

export function getMediaButtonControlDefaultConfig(
  action: MediaButtonAction,
  stateObj?: MediaPlayerEntity,
): MediaButtonControlBaseConfig {
  return mediaButtonDefaultMap[action](stateObj);
}

export function getMediaToggleControlDefaultConfig(
  kind: string,
): MediaToggleControlBaseConfig {
  return mediaToggleDefaultMap[kind];
}

function translateMediaButtonControl(
  control: MediaButtonControlConfig,
  stateObj?: HassEntityBase,
): ConcreteMediaButtonControl | undefined {
  const mediaButtonActionAvailability = getMediaButtonActionAvailability(
    stateObj as MediaPlayerEntity,
  );

  const { supported, applicable } =
    mediaButtonActionAvailability[control.action];

  if (!applicable && !control.always_show) {
    // the action is available but should not be shown because of the state
    return undefined;
  }

  const config = {
    ...getMediaButtonControlDefaultConfig(
      control.action,
      stateObj as MediaPlayerEntity,
    ),
    ...control,
  };

  if (!supported && config.when_unavailable === ElementWhenUnavailable.HIDE) {
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
    disabled: !supported,
  } as ConcreteMediaButtonControl;
}

function translateMediaToggleControl(
  control: MediaToggleControlConfig,
  stateObj?: HassEntityBase,
) {
  const defaultConfig = getMediaToggleControlDefaultConfig(control.kind);

  return mediaToggleKindActionMap[control.kind].map((action) => {
    const buttonConfig = mediaToggleActionToMediaButtonControlConfig(
      control,
      action,
    );

    return translateMediaButtonControl(
      {
        ...buttonConfig,
        when_unavailable:
          control.when_unavailable ?? defaultConfig.when_unavailable,
      },
      stateObj,
    );
  });
}

export function mediaToggleActionToMediaButtonControlConfig(
  config: MediaToggleControlConfig,
  action: MediaButtonAction,
): MediaButtonControlConfig {
  return {
    type: ControlType.MEDIA_BUTTON,
    action,
    ...(config[action] ?? {}),
  };
}

export function translateControls({
  controls,
  stateObj,
}: {
  controls?: ControlConfig[];
  stateObj?: HassEntityBase;
}): ConcreteControl[] {
  if (!controls) {
    return [];
  }

  return controls
    .flatMap((control) => {
      switch (control.type) {
        case ControlType.MEDIA_BUTTON:
          return translateMediaButtonControl(control, stateObj);
        case ControlType.MEDIA_TOGGLE:
          return translateMediaToggleControl(control, stateObj);
        case ControlType.MEDIA_POSITION:
          const supportsSeek = stateObj
            ? supportsFeature(
                stateObj as MediaPlayerEntity,
                MediaPlayerEntityFeature.SEEK,
              )
            : false;

          return {
            type: ControlType.MEDIA_POSITION,
            timestamp_position: control.timestamp_position,
            disabled: !supportsSeek,
          };
        default:
          return undefined;
      }
    })
    .filter((control) => control !== undefined) as ConcreteControl[];
}
