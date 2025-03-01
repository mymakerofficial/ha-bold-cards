import { mediaButtonActionIconMap } from "./constants";
import { ControlConfig, ControlType, MediaButtonControlConfig } from "./types";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { t } from "../../localization/i18n";

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
    default:
      return "";
  }
}

export function getControlLabel(control: ControlConfig) {
  switch (control.type) {
    case ControlType.MEDIA_BUTTON:
      return t(control.action, {
        scope: "common.media_control_action",
      });
    default:
      return control.type;
  }
}
