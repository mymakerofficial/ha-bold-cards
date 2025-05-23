import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardConfig,
  LovelaceCardConstructor,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import {
  isDefined,
  isEmpty,
  isObject,
  isUndefined,
  toPromise,
} from "../helpers";
import { Maybe } from "../types";
import { LitElement } from "lit";
import { CustomCardEntry } from "../../types/card";
import { isLovelaceCardConfigWithEntity } from "./guards";
import { getEntityName } from "../entities/helpers";
import { Result } from "../result";

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
): Result<LovelaceCardConstructor> {
  return Result.run(() => {
    const tag = getLovelaceCardTag(type);

    const cls = customElements.get(tag);

    if (isDefined(cls)) {
      return cls as LovelaceCardConstructor;
    }

    throw new Error(`Element not found: ${type}`);
  });
}

export async function getLovelaceCardConfigElement(type: string) {
  return Result.runAsync(async () => {
    const cardClass = getLovelaceCardElementClass(type).get();

    if (isUndefined(cardClass.getConfigElement)) {
      throw new Error(`Card ${type} does not have a config element`);
    }

    return await toPromise(cardClass.getConfigElement());
  });
}

export async function getLovelaceCardConfigForm(type: string) {
  return Result.runAsync(async () => {
    const cardClass = getLovelaceCardElementClass(type).get();

    if (isUndefined(cardClass.getConfigForm)) {
      throw new Error(`Card ${type} does not have a config form`);
    }

    return await toPromise(cardClass.getConfigForm());
  });
}

export function getCardStubConfig(
  hass: HomeAssistant,
  type: string,
  entities: string[],
  entitiesFallback?: string[],
): Promise<Result<LovelaceCardConfig>> {
  return Result.runAsync(async () => {
    const card = getLovelaceCardElementClass(type).get();

    if (isUndefined(card.getStubConfig)) {
      throw new Error(`Card ${type} does not support getStubConfig`);
    }

    const stubConfig = await toPromise(
      card.getStubConfig(hass, entities, entitiesFallback ?? entities),
    );

    // some cards don't behave like they are supposed to,
    //  so we need to make sure it doesn't break
    if (!isObject(stubConfig)) {
      throw new Error(`Card ${type} getStubConfig did not return an object`);
    }

    return stubConfig;
  });
}

export function getCardGridOptions(
  hass: HomeAssistant,
  config: LovelaceCardConfig,
): Result<LovelaceGridOptions> {
  return Result.run(() => {
    const tag = getLovelaceCardTag(config.type);
    const el = document.createElement(tag) as LovelaceCard & LitElement;

    if (isUndefined(el.setConfig) || isUndefined(el.getGridOptions)) {
      throw new Error(`Card ${config.type} does not support getGridOptions`);
    }

    el.hass = hass;
    el.setConfig(config);

    const gridOptions = el.getGridOptions();

    if (!isObject(gridOptions)) {
      throw new Error(
        `Card ${config.type} getGridOptions did not return an object`,
      );
    }

    return gridOptions;
  });
}

export async function getEntitiesForCard(
  hass: HomeAssistant,
  type: string,
  entities: string[],
  maxCount: number,
) {
  const pickedEntities = new Set<string>();

  while (pickedEntities.size < maxCount) {
    const availableEntities = entities.filter(
      (entity) => !pickedEntities.has(entity),
    );

    const entity = await getNextEntityForCard(hass, type, availableEntities);

    if (isUndefined(entity) || isEmpty(entity) || pickedEntities.has(entity)) {
      // no entity was provided so we can stop
      break;
    }

    pickedEntities.add(entity);
  }

  return [...pickedEntities.values()];
}

export async function getAllEntitiesForCard(hass: HomeAssistant, type: string) {
  return getEntitiesForCard(
    hass,
    type,
    Object.keys(hass.states),
    Object.keys(hass.states).length,
  );
}

async function getNextEntityForCard(
  hass: HomeAssistant,
  type: string,
  availableEntities: string[],
) {
  const stub = await getCardStubConfig(
    hass,
    type,
    availableEntities,
    availableEntities,
  );
  return stub.getOrUndefined()?.entity as Maybe<string>;
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

export function getCardConfigHumanReadableName(
  config: LovelaceCardConfig,
  hass?: HomeAssistant,
) {
  const typeName = getCardTypeName(config.type, hass);
  if (isLovelaceCardConfigWithEntity(config)) {
    const entityName = getEntityName(config.entity, hass);
    return [typeName, entityName];
  }
  return [typeName];
}
