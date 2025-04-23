import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardConstructor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { isDefined, isEmpty, isUndefined, toPromise } from "../helpers";
import { Optional } from "../types";
import { LitElement } from "lit";
import { CustomCardEntry } from "../../types/card";

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

export function getCardEditorTag(type: string) {
  return `${stripCustomPrefix(type)}-editor`;
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

export async function getEntitiesForCard(
  hass: HomeAssistant,
  type: string,
  entities: string[],
  count: number,
) {
  const pickedEntities: string[] = [];

  while (count > pickedEntities.length) {
    const availableEntities = entities.filter(
      (entity) => !pickedEntities.includes(entity),
    );

    const entity = await getNextEntityForCard(hass, type, availableEntities);

    if (isUndefined(entity) || isEmpty(entity)) {
      // no entity was provided so we can stop
      break;
    }

    pickedEntities.push(entity);
  }

  return pickedEntities;
}

async function getNextEntityForCard(
  hass: HomeAssistant,
  type: string,
  availableEntities: string[],
) {
  const stub = await getCardStubConfig(hass, type, availableEntities);
  return stub.entity as Optional<string>;
}

export function getCustomCardEntries() {
  return (
    ((window as any).customCards as CustomCardEntry[] | undefined) ?? []
  ).reduce((acc, entry) => {
    acc[entry.type] = entry;
    return acc;
  }, {}) as Record<string, CustomCardEntry>;
}

export function getCardTypeName(type: string, hass?: HomeAssistant) {
  if (isCustomType(type)) {
    const customType = stripCustomPrefix(type);
    const customCardEntry = getCustomCardEntries()[customType];
    return customCardEntry?.name || type;
  }
  return hass?.localize(`ui.panel.lovelace.editor.card.${type}.name`) || type;
}
