import { HomeAssistant } from "../types/ha/lovelace";
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
  getDeviceByEntityId,
  getEntityByEntityId,
  getStateObj,
} from "./entities/helpers";
import { getFeatureTypeLabel } from "../editors/cards/features/helpers";
import { dedupeMediaPlayerEntities } from "./media-player/helpers";
import { browseMediaPlayer } from "./media-player/media-browser";

type HassObjectConstructor<T = {}> = new (...args: any[]) => T;

export function HassObjectMixin<TBase extends HassObjectConstructor>(
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
  };
}

export class HassObject extends HassObjectMixin(Object) {
  public hass?: HomeAssistant;

  constructor(hass?: HomeAssistant) {
    super();
    this.hass = hass;
  }
}
