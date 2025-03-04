import { mediaButtonActionIconMap, mediaButtonDefaultMap } from "./constants";
import {
  BaseButtonControlConfig,
  ConcreteControl,
  ConcreteMediaButtonControl,
  ControlConfig,
  ControlType,
  MediaButtonAction,
  ElementWhenUnavailable,
} from "./types";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { t } from "../../localization/i18n";
import { getMediaButtonActionAvailability } from "../../helpers/media-player";

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
    default:
      return t(control.type, {
        scope: "common.control_type",
      });
  }
}

export function getMediaButtonControlDefaultConfig(
  action: MediaButtonAction,
  stateObj: MediaPlayerEntity,
): BaseButtonControlConfig {
  return mediaButtonDefaultMap[action](stateObj as MediaPlayerEntity);
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

  const mediaButtonActionAvailability = getMediaButtonActionAvailability(
    stateObj as MediaPlayerEntity,
  );

  return controls
    .map((control) => {
      switch (control.type) {
        case ControlType.MEDIA_BUTTON:
          const { supported, applicable } =
            mediaButtonActionAvailability[control.action];

          if (!applicable) {
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

          if (
            !supported &&
            config.when_unavailable === ElementWhenUnavailable.HIDE
          ) {
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
        default:
          return control; // TODO
      }
    })
    .filter((control) => control !== undefined) as ConcreteControl[];
}
