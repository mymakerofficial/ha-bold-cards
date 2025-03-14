import { property } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { LitElement } from "lit";
import {
  getDeviceByEntityId,
  getEntityByEntityId,
  getStateObj,
} from "../lib/entities/helpers";
import { getFeatureTypeLabel } from "../editors/cards/features/helpers";
import {
  getMediaPlayerChildEntityRecursively,
  getUniversalMediaPlayerChildStateObj,
  UniversalMediaPlayerEnhancements,
} from "../lib/media-player/universal-media-player";
import { MediaPlayerEntity } from "../types/ha/entity";
import { isStateActive } from "../helpers/states";
import { dedupeMediaPlayerEntities } from "../lib/media-player/helpers";

export class BoldHassElement extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

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
}
