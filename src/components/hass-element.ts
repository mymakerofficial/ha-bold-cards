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
  getUniversalMediaPlayerChildStateObj,
  UniversalMediaPlayerEnhancements,
} from "../lib/media-player/universal-media-player";
import { MediaPlayerEntity } from "../types/ha/entity";
import { isStateActive } from "../helpers/states";
import { dedupeMediaPlayerEntities } from "../lib/media-player/helpers";
import { browseMediaPlayer } from "../lib/media-player/media-browser";
import {
  RenderTemplateParams,
  subscribeToRenderTemplate,
} from "../lib/templates/helpers";

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

  protected async browseMediaPlayer(
    entityId: string,
    mediaContentId?: string,
    mediaContentType?: string,
  ) {
    if (!this.hass) {
      return Promise.reject(new Error("No Home Assistant instance available"));
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
}
