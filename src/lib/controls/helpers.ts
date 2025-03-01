import { mediaButtonActionIconMap } from "./constants";
import { ControlConfig, ControlType } from "./types";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { MediaPlayerEntity } from "../../types/ha/entity";

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
