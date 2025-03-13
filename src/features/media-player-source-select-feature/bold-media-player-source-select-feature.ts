import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerSourceSelectFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { styleMap } from "lit-html/directives/style-map";
import { getMediaPlayerChildEntityRecursively } from "../../lib/entities/universal-media-player";
import { getEntityEntryFromEntityId } from "../../lib/entities/helpers";

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

  protected getIcon(source?: string) {
    if (!source) {
      return "mdi:import";
    }

    const checks = new Map([
      [/home assistant/i, "mdi:home-assistant"],
      [/spotify/i, "mdi:spotify"],
      [/youtube/i, "mdi:youtube"],
      [/netflix/i, "mdi:netflix"],
      [/hdmi/i, "mdi:hdmi-port"],
      [/ext|analogue|comp/i, "mdi:composite"],
      [/bluetooth/i, "mdi:bluetooth"],
      [/line|aux/i, "mdi:rca"],
      [/wifi|wireless|cast/i, "mdi:wifi"],
      [/optical|toslink/i, "mdi:optical-audio"],
      [/cd|dvd|disc/i, "mdi:disc-player"],
      [/airplay/i, "mdi:airplay"],
      [/tv|fehrnsehr|display/i, "mdi:tv"],
      [/speaker?s/i, "mdi:speaker"],
      [/stereo|audio|wiim/i, "mdi:audio-video"],
      [/linux/i, "mdi:linux"],
      [/desktop/i, "mdi:desktop-classic"],
      [/macbook|dell|hp|lenovo/i, "mdi:laptop"],
      [/pixel|samsung|i?phone/i, "mdi:cellphone"],
      [/home/i, "mdi:home-outline"],
      [/group|all|room|zimmer|haus/i, "mdi:speaker-multiple"],
      [/off/i, "mdi:power"],
    ]);

    return (
      Array.from(checks.entries()).find(([regex]) => regex.test(source))?.[1] ??
      "mdi:import"
    );
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

    let title = "Source";

    if (childEntity?.platform === "spotify") {
      title = "Playing Spotify on";
    }

    const icon = this.getIcon(this.stateObj.attributes.source);

    return html`
      <div
        class="container"
        style=${styleMap({
          "--feature-size": 1.5,
        })}
      >
        <div class="title">${title}</div>
        <div class="source">${this.stateObj.attributes.source}</div>
        <div class="icon">
          <ha-icon .icon=${icon}></ha-icon>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --feature-background: color-mix(
          in srgb,
          var(--ha-card-background),
          var(--lovelace-background) 80%
        );
      }

      * {
        box-sizing: border-box;
      }

      .container {
        position: relative;
        --container-height: calc(
          var(--feature-height) * var(--feature-size) + var(--feature-gap) *
            (var(--feature-size) - 1)
        );
        height: var(--container-height);
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr 1fr;
        grid-template-areas: "title icon" "source icon";
        background: var(--feature-background);
        border-radius: calc(
          var(--ha-card-border-radius, 12px) - var(--feature-gap) / 2
        );
        padding: 16px;
      }

      .title {
        grid-area: title;
        font-size: 0.8rem;
        font-weight: 500;
        opacity: 0.5;
        line-height: unset;
        margin-left: 4px;
        align-self: end;
      }

      .source {
        grid-area: source;
        font-size: 1.1rem;
        font-weight: 500;
        line-height: unset;
        margin-left: 4px;
        align-self: start;
      }

      .icon {
        grid-area: icon;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        aspect-ratio: 1 / 1;
        background-color: var(--tile-color, var(--primary-color));
        color: var(--feature-background);
        border-radius: calc(var(--container-height) / 4);
      }
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
