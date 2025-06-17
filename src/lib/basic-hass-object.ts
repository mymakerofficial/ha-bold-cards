import { MediaPlayerEntity } from "../types/ha/entity";
import {
  getUniversalMediaPlayerChildStateObj,
  UniversalMediaPlayerEnhancements,
} from "./media-player/universal-media-player";
import { isStateActive } from "../helpers/states";
import {
  getDeviceByDeviceId,
  getDeviceByEntityId,
  getEntityByEntityId,
  getEntityName,
  getStateObj,
} from "./entities/helpers";
import { getFeatureTypeLabel } from "../editors/cards/features/helpers";
import { dedupeMediaPlayerEntities } from "./media-player/helpers";
import { browseMediaPlayer } from "./media-player/media-browser";
import { HomeAssistant, LovelaceCardConfig } from "../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { computeIsDarkMode } from "./theme";
import {
  getAllEntitiesForCard,
  getCardConfigHumanReadableName,
  getCardGridOptions,
  getCardStubConfig,
  getCardTypeName,
  getEntitiesForCard,
} from "./cards/helpers";
import { Result } from "./result";

// hass object is split into two files to avoid circular dependencies
//  any class that extends the hass object and is also used in the hass object should only import the basic-hass-object.ts file

export type HassObjectConstructor<T = object> = new (...args: any[]) => T;

export class HassUndefinedError extends Error {
  constructor() {
    super("No Home Assistant instance available");
    this.name = "HassUndefinedError";
  }
}

export function BasicHassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends Base {
    public hass?: HomeAssistant;

    protected getStateObj<T extends HassEntity = HassEntity>(
      entityId?: string,
    ) {
      return getStateObj<T>(entityId, this.hass);
    }

    protected getEntityByEntityId(entityId?: string) {
      return getEntityByEntityId(entityId, this.hass);
    }

    protected getDeviceByDeviceId(deviceId?: string) {
      return getDeviceByDeviceId(deviceId, this.hass);
    }

    protected getDeviceByEntityId(entityId?: string) {
      return getDeviceByEntityId(entityId, this.hass);
    }

    protected getEntityName(entityId?: string) {
      return getEntityName(entityId, this.hass);
    }

    protected getFeatureTypeLabel(type: string) {
      return getFeatureTypeLabel(type, this.hass);
    }

    protected getCardTypeName(type: string) {
      return getCardTypeName(type, this.hass);
    }

    protected getCardConfigHumanReadableName(config: LovelaceCardConfig) {
      return getCardConfigHumanReadableName(config, this.hass);
    }

    protected getUniversalMediaPlayerChildStateObj(
      stateObj?: MediaPlayerEntity,
      universalMediaPlayerChildEnhancements?: UniversalMediaPlayerEnhancements,
    ) {
      return getUniversalMediaPlayerChildStateObj(
        stateObj,
        universalMediaPlayerChildEnhancements,
        this.hass,
      );
    }

    protected isStateActiveByEntityId(entityId?: string) {
      const stateObj = this.getStateObj(entityId);
      return isStateActive(stateObj);
    }

    protected dedupeMediaPlayerEntities(entityIds: string[]) {
      return dedupeMediaPlayerEntities(entityIds, this.hass);
    }

    protected async browseMediaPlayer(
      entityId: string,
      mediaContentId?: string,
      mediaContentType?: string,
    ) {
      if (!this.hass) {
        throw new HassUndefinedError();
      }
      return browseMediaPlayer(
        this.hass,
        entityId,
        mediaContentId,
        mediaContentType,
      );
    }

    protected isDarkMode() {
      return computeIsDarkMode(this.hass);
    }

    protected async getCardStubConfig(
      type: string,
      entities: string[],
      entitiesFallback?: string[],
    ) {
      return Result.wrapAsync(() => {
        if (!this.hass) {
          throw new HassUndefinedError();
        }

        return getCardStubConfig(this.hass, type, entities, entitiesFallback);
      });
    }

    protected getCardGridOptions(config: LovelaceCardConfig) {
      return Result.wrap(() => {
        if (!this.hass) {
          throw new HassUndefinedError();
        }

        return getCardGridOptions(this.hass, config);
      });
    }

    protected async getEntitiesForCard(
      type: string,
      entities: string[],
      count: number,
    ) {
      if (!this.hass) {
        throw new HassUndefinedError();
      }

      return await getEntitiesForCard(this.hass, type, entities, count);
    }

    protected async getAllEntitiesForCard(type: string) {
      if (!this.hass) {
        throw new HassUndefinedError();
      }

      return await getAllEntitiesForCard(this.hass, type);
    }

    protected getAllEntityIds() {
      if (!this.hass) {
        throw new HassUndefinedError();
      }

      return Object.keys(this.hass.states);
    }
  };
}

export class BaseHassObject {
  public hass?: HomeAssistant;

  constructor(hass?: HomeAssistant) {
    this.hass = hass;
  }
}

export class BasicHassObject extends BasicHassObjectMixin(BaseHassObject) {}
