import { ControlConfig, ControlType } from "../../../lib/controls/types";
import { HassEntityBase } from "home-assistant-js-websocket";
import { FeatureInternals } from "../../../types/ha/feature";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { nothing } from "lit";
import { ControlEditorBase } from "./base";

const controlEditorMap = {
  [ControlType.MEDIA_BUTTON]: "bc-media-button-control-editor",
  [ControlType.MEDIA_TOGGLE]: "bc-media-toggle-control-editor",
  [ControlType.MEDIA_POSITION]: "bc-media-position-control-editor",
} as const satisfies Partial<{
  [key in ControlType]: string;
}>;

const importElements = {
  "bc-media-button-control-editor": () =>
    import("./bc-media-button-control-editor"),
  "bc-media-toggle-control-editor": () =>
    import("./bc-media-toggle-control-editor"),
  "bc-media-position-control-editor": () =>
    import("./bc-media-position-control-editor"),
} satisfies {
  [key in (typeof controlEditorMap)[keyof typeof controlEditorMap]]: () => Promise<unknown>;
};

export function getControlEditorElement({
  control,
  stateObj,
  internals,
  hass,
  onValueChanged,
}: Readonly<{
  control: ControlConfig;
  stateObj?: HassEntityBase;
  internals?: FeatureInternals;
  hass?: HomeAssistant;
  onValueChanged: (ev: CustomEvent) => void;
}>) {
  const key = controlEditorMap[control.type];

  if (!key) {
    return undefined;
  }

  importElements[key]().then();

  const element = document.createElement(key) as ControlEditorBase;

  element.control = control;
  element.stateObj = stateObj;
  element.internals = internals;
  element.hass = hass;
  // @ts-ignore
  element.addEventListener("value-changed", onValueChanged);

  return element;
}
