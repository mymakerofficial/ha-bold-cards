import { MediaPlayerEntity } from "../types/ha/entity";
import {
  getUniversalMediaPlayerChildStateObj,
  UniversalMediaPlayerEnhancements,
} from "./media-player/universal-media-player";
import { isStateActive } from "../helpers/states";
import {
  RenderTemplateParams,
  subscribeToRenderTemplate,
} from "./templates/helpers";
import {
  getDeviceByDeviceId,
  getDeviceByEntityId,
  getEntityByEntityId,
  getStateObj,
} from "./entities/helpers";
import { getFeatureTypeLabel } from "../editors/cards/features/helpers";
import { dedupeMediaPlayerEntities } from "./media-player/helpers";
import { browseMediaPlayer } from "./media-player/media-browser";
import { HomeAssistant } from "../types/ha/lovelace";
import { getStubWeatherEntity } from "./weather/helpers";

// hass object is split into two files to avoid circular dependencies
//  any class that extends the hass object and is also used in the hass object should only import the basic-hass-object.ts file

export type HassObjectConstructor<T = {}> = new (...args: any[]) => T;

export function BasicHassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends Base {
    public hass?: HomeAssistant;

    protected getStateObj(entityId?: string) {
      return getStateObj(entityId, this.hass);
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

    protected getFeatureTypeLabel(type: string) {
      return getFeatureTypeLabel(type, this.hass);
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
        return Promise.reject(
          new Error("No Home Assistant instance available"),
        );
      }
      return browseMediaPlayer(
        this.hass,
        entityId,
        mediaContentId,
        mediaContentType,
      );
    }

    protected async subscribeToRenderTemplate(params: RenderTemplateParams) {
      return subscribeToRenderTemplate(this.hass!.connection, params);
    }

    protected getStubWeatherEntity() {
      return getStubWeatherEntity(this.hass);
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
