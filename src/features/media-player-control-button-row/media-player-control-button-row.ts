import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { MediaPlayerControlButtonRowFeatureConfig } from "./types";
import {
  getMediaControls,
  handleMediaPlayerAction,
  MediaControlAction,
} from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { ButtonSize, limitButtonSize } from "../../components/bc-button";
import { MediaControlButtonActionEvent } from "../../components/bc-media-control-button-row";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { styleMap } from "lit-html/directives/style-map";
import { FeatureConfigWithMaybeInternals } from "../../types/ha/feature";

function getControls(
  config: FeatureConfigWithMaybeInternals<MediaPlayerControlButtonRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  if (!stateObj) {
    return [];
  }
  return getMediaControls(stateObj, true)
    .filter(({ action }) => config.controls?.includes(action))
    .map((it) => ({
      ...it,
      size: limitButtonSize(
        it.size ?? ButtonSize.MD,
        config.__custom_internals ? ButtonSize.XL : ButtonSize.SM,
      ),
    }));
}

function getFeatureSize(
  config: FeatureConfigWithMaybeInternals<MediaPlayerControlButtonRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  const controls = getControls(config, stateObj);
  if (!controls.length) {
    return 0;
  }
  const hasLargeButtons = controls.some(
    ({ size }) => size === ButtonSize.LG || size === ButtonSize.XL,
  );
  return hasLargeButtons ? 2 : 1;
}

@customElement("media-player-control-button-row")
export class MediaPlayerControlButtonRowFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  MediaPlayerControlButtonRowFeatureConfig
> {
  static getStubConfig(): MediaPlayerControlButtonRowFeatureConfig {
    return {
      type: "custom:media-player-control-button-row",
      controls: [
        MediaControlAction.SHUFFLE_SET,
        MediaControlAction.MEDIA_PLAY,
        MediaControlAction.MEDIA_PAUSE,
        MediaControlAction.MEDIA_PREVIOUS_TRACK,
        MediaControlAction.MEDIA_NEXT_TRACK,
        MediaControlAction.REPEAT_SET,
      ],
    };
  }

  private get _controls() {
    return getControls(this._config!, this.stateObj!);
  }

  private get _featureSize() {
    return getFeatureSize(this._config!, this.stateObj!);
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    return html`
      <div
        class="container"
        style=${styleMap({
          "--feature-size": this._featureSize,
        })}
      >
        <bc-media-control-button-row
          center=${true}
          .controls=${this._controls}
          @action="${this._handleAction}"
        ></bc-media-control-button-row>
      </div>
    `;
  }

  private _handleAction(event: MediaControlButtonActionEvent) {
    handleMediaPlayerAction({
      hass: this.hass!,
      stateObj: this.stateObj!,
      action: event.detail.action,
    }).then();
  }

  static get styles() {
    return css`
      bc-media-control-button-row {
        --button-row-gap: 8px;
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(
          var(--feature-height) * var(--feature-size) + var(--feature-padding) *
            (var(--feature-size) - 1)
        );
      }
    `;
  }
}

MediaPlayerControlButtonRowFeature.registerCustomFeature<
  MediaPlayerEntity,
  MediaPlayerControlButtonRowFeatureConfig
>({
  type: "media-player-control-button-row",
  name: "Media Player Control Button Row",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (config, stateObj) => getFeatureSize(config, stateObj),
  configurable: false,
});
