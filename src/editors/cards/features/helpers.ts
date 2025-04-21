import {
  CustomCardFeatureEntry,
  LovelaceCardFeatureConfig,
  LovelaceCardFeatureConstructor,
} from "../../../types/ha/feature";
import { HomeAssistant } from "../../../types/ha/lovelace";
import { UI_FEATURE_TYPES } from "./constants";
import { HassEntity } from "home-assistant-js-websocket";

const CUSTOM_PREFIX = "custom:";

const BOLD_PREFIX = "bold-";

export function isCustomType(type: string) {
  return type.startsWith(CUSTOM_PREFIX);
}

export function stripCustomPrefix(type: string) {
  if (!isCustomType(type)) {
    return type;
  }
  return type.slice(CUSTOM_PREFIX.length);
}

export function isBoldType(type: string) {
  return type.startsWith(CUSTOM_PREFIX + BOLD_PREFIX);
}

export function getCustomFeatureEntries() {
  return (
    ((window as any).customCardFeatures as
      | CustomCardFeatureEntry[]
      | undefined) ?? []
  ).reduce((acc, entry) => {
    acc[entry.type] = entry;
    return acc;
  }, {}) as Record<string, CustomCardFeatureEntry>;
}

export function getFeatureTypes() {
  const featureTypes = UI_FEATURE_TYPES;
  const customFeatureEntries = getCustomFeatureEntries();
  return [
    ...featureTypes,
    ...Object.values(customFeatureEntries).map(
      (entry) => CUSTOM_PREFIX + entry.type,
    ),
  ];
}

export function getFeatureTypeLabel(type: string, hass?: HomeAssistant) {
  if (isCustomType(type)) {
    const customType = stripCustomPrefix(type);
    const customFeatureEntry = getCustomFeatureEntries()[customType];
    return customFeatureEntry?.name || type;
  }
  return (
    hass?.localize(`ui.panel.lovelace.editor.features.types.${type}.label`) ||
    type
  );
}

export function getIsFeatureTypeEditable(type: string) {
  if (isCustomType(type)) {
    const customType = stripCustomPrefix(type);
    const customFeatureEntry = getCustomFeatureEntries()[customType];
    return customFeatureEntry?.configurable || false;
  }
  return false; // TODO
}

// TODO extract to lib
export function getFeatureStubConfig(
  type: string,
  hass: HomeAssistant,
  stateObj?: HassEntity,
) {
  const tag = isCustomType(type) ? stripCustomPrefix(type) : `hui-${type}`;

  const el = customElements.get(tag) as
    | LovelaceCardFeatureConstructor
    | undefined;

  if (el && el.getStubConfig) {
    return el.getStubConfig(hass, stateObj);
  } else {
    return { type } as LovelaceCardFeatureConfig;
  }
}
