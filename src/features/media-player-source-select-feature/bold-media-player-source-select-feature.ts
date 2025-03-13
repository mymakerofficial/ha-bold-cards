import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerSourceSelectFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { getMediaPlayerChildEntityRecursively } from "../../lib/media-player/universal-media-player";
import { getEntityEntryFromEntityId } from "../../lib/entities/helpers";
import { getMediaPlayerSourceIcon } from "../../lib/media-player/source";

@customElement("bold-media-player-source-select")
export class BoldMediaPlayerSourceSelectFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  BoldMediaPlayerSourceSelectFeatureConfig
> {
  static getStubConfig(): BoldMediaPlayerSourceSelectFeatureConfig {
    return {
      type: "custom:bold-media-player-source-select",
    };
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    const childStateObj = getMediaPlayerChildEntityRecursively(
      this.stateObj,
      (entity) =>
        !!entity.attributes.device_class || !!entity.attributes.active_child,
      this.hass,
    );

    const childEntity = getEntityEntryFromEntityId(
      childStateObj.entity_id,
      this.hass,
    );

    let label = "Source";

    if (childEntity?.platform === "spotify") {
      label = "Playing Spotify on";
    }

    return html`
      <bc-large-select-menu
        .value=${this.stateObj.attributes.source}
        .label=${label}
      >
        ${this.stateObj.attributes.source_list?.map(
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
  type: "bold-media-player-source-select",
  name: "Media Player Source Select",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (_config, _stateObj) => 1.5,
  doesRender: (_config, stateObj) => !!stateObj.attributes.source,
  configurable: false,
});
