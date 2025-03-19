import { customElement } from "lit/decorators";
import { html, nothing } from "lit";
import { BoldMediaPlayerSourceSelectFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { getEntityByEntityId } from "../../lib/entities/helpers";
import { getMediaPlayerSourceIcon } from "../../lib/media-player/source";
import { stopPropagation } from "../../editors/helpers";
import { BoldFeatureType } from "../../lib/features/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";

const featureType = BoldFeatureType.MEDIA_PLAYER_SOURCE_SELECT;

@customElement(stripCustomPrefix(featureType))
export class BoldMediaPlayerSourceSelectFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  BoldMediaPlayerSourceSelectFeatureConfig
> {
  static get featureType() {
    return featureType;
  }

  static getStubConfig(): BoldMediaPlayerSourceSelectFeatureConfig {
    return {
      type: this.featureType,
    };
  }

  protected get _childStateObj() {
    const config =
      this._config?.universal_media_player_enhancements ??
      this.boldInternals?.universal_media_player_enhancements;
    return this.getUniversalMediaPlayerChildStateObj(this.stateObj, config);
  }

  protected get _childEntity() {
    return getEntityByEntityId(this._childStateObj?.entity_id, this.hass);
  }

  protected get _sourceList() {
    const sourceList = this.stateObj?.attributes.source_list ?? [];

    if (
      this.stateObj?.attributes.source &&
      !sourceList.includes(this.stateObj?.attributes.source)
    ) {
      sourceList.unshift(this.stateObj?.attributes.source);
    }

    return sourceList.filter((source) => source !== "");
  }

  protected _handleSelected(ev: CustomEvent) {
    stopPropagation(ev);

    if (!this.hass || !this.stateObj) {
      return;
    }

    const index = ev.detail.index;
    const source = this.stateObj.attributes.source_list?.[index];
    const oldSource = this.stateObj?.attributes.source;

    if (source === undefined || source === oldSource) {
      return;
    }

    this.hass
      .callService("media_player", "select_source", {
        entity_id: this.stateObj.entity_id,
        source,
      })
      .then();
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    if (!this.getDoesRender()) {
      return nothing;
    }

    const childEntity = this._childEntity;

    let label = "Source";

    if (childEntity?.platform === "spotify") {
      label = "Playing Spotify on";
    }

    const sourceList = this._sourceList;

    return html`
      <bc-large-select-menu
        .label=${label}
        .value=${this.stateObj.attributes.source}
        @selected=${this._handleSelected}
        @closed=${stopPropagation}
      >
        ${sourceList.map(
          (source) => html`
            <ha-list-item .value=${source} graphic="icon">
              <ha-icon
                .icon=${getMediaPlayerSourceIcon(source)}
                slot="graphic"
              ></ha-icon>
              <span>${source}</span>
            </ha-list-item>
          `,
        )}
      </bc-large-select-menu>
    `;
  }
}

BoldMediaPlayerSourceSelectFeature.registerCustomFeature<
  MediaPlayerEntity,
  BoldMediaPlayerSourceSelectFeatureConfig
>({
  name: "Media Player Source Select",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (_config, _stateObj) => 1.5,
  doesRender: (_config, stateObj) => !!stateObj.attributes.source,
  configurable: false,
});
