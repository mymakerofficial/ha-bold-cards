import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardConstructor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { isDefined, isUndefined, toPromise } from "../helpers";
import { Optional } from "../types";
import { LitElement } from "lit";

const CUSTOM_PREFIX = "custom:";

export function isCustomType(type: string) {
  return type.startsWith(CUSTOM_PREFIX);
}

export function stripCustomPrefix(type: string) {
  if (!isCustomType(type)) {
    return type;
  }
  return type.slice(CUSTOM_PREFIX.length);
}

export function prefixCustomType(type: string) {
  return `${CUSTOM_PREFIX}${type}`;
}

export function optionallyPrefixCustomType(
  type: string,
  shouldPrefix?: boolean,
) {
  if (shouldPrefix) {
    return prefixCustomType(type);
  }
  return stripCustomPrefix(type);
}

function getLovelaceCardTag(type: string) {
  if (isCustomType(type)) {
    return stripCustomPrefix(type);
  }
  return `hui-${type}-card`;
}

export function getLovelaceCardElementClass(
  type: string,
): LovelaceCardConstructor {
  const tag = getLovelaceCardTag(type);

  const cls = customElements.get(tag);

  if (isDefined(cls)) {
    return cls as LovelaceCardConstructor;
  }

  throw new Error(`Element not found: ${type}`);
}

export async function getCardStubConfig(
  hass: HomeAssistant,
  type: string,
  entities: string[],
  entitiesFallback?: string[],
): Promise<LovelaceCardConfig> {
  const card = getLovelaceCardElementClass(type);

  if (isUndefined(card.getStubConfig)) {
    return {
      type,
    };
  }

  return toPromise(
    card.getStubConfig(hass, entities, entitiesFallback ?? entities),
  );
}
export function getCardGridOptions(
  hass: HomeAssistant,
  config: LovelaceCardConfig,
): Optional<LovelaceGridOptions> {
  const tag = getLovelaceCardTag(config.type);
  const el = document.createElement(tag) as LovelaceCard & LitElement;

  el.hass = hass;
  el.setConfig(config);

  return el.getGridOptions?.();
}
