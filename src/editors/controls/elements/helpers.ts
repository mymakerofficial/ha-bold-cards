import { ControlConfig, ControlType } from "../../../lib/controls/types";
import { HassEntityBase } from "home-assistant-js-websocket";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { ControlEditorBase } from "./base";
import { FeatureInternals } from "../../../lib/internals/types";

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

  // TODO handle loading
  importElements[key]().then();

  const element = document.createElement(key) as ControlEditorBase;

  element.control = control;
  element.stateObj = stateObj;
  element.internals = internals;
  element.hass = hass;
  // @ts-expect-error value-changed is not a standard event
  element.addEventListener("value-changed", onValueChanged);

  return element;
}
