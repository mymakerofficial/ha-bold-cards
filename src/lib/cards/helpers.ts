import {
  HomeAssistant,
  LovelaceCardConfig,
  LovelaceCardConstructor,
} from "../../types/ha/lovelace";
import { isDefined, isUndefined, toPromise } from "../helpers";

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

export function getLovelaceCardElementClass(
  type: string,
): LovelaceCardConstructor {
  if (isCustomType(type)) {
    const tag = stripCustomPrefix(type);
    const customCls = customElements.get(tag);

    if (isDefined(customCls)) {
      return customCls as LovelaceCardConstructor;
    }
  } else {
    const tag = `hui-${type}-card`;
    const cls = customElements.get(tag);

    if (isDefined(cls)) {
      return cls as LovelaceCardConstructor;
    }
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
