import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerControlRowFeatureConfig } from "./types";
import { handleMediaPlayerAction } from "../../helpers/media-player";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { ButtonSize, limitButtonSize } from "../../components/bc-button";
import { MediaControlButtonActionEvent } from "../../components/bc-media-control-button-row";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { styleMap } from "lit-html/directives/style-map";
import { FeatureConfigWithMaybeInternals } from "../../types/ha/feature";

import {
  ControlType,
  MediaButtonAction,
  MediaButtonControlConfig,
} from "../../lib/controls/types";
import { translateControls } from "../../lib/controls/helpers";
import { LovelaceCardFeatureEditor } from "../../types/ha/lovelace";

function getControls(
  config: FeatureConfigWithMaybeInternals<BoldMediaPlayerControlRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  return translateControls({
    controls: config.controls,
    stateObj,
  }).map((control) => ({
    ...control,
    size: limitButtonSize(
      (control as MediaButtonControlConfig).size ?? ButtonSize.MD,
      config.__custom_internals ? ButtonSize.XL : ButtonSize.SM,
    ),
  }));
}

function getFeatureSize(
  config: FeatureConfigWithMaybeInternals<BoldMediaPlayerControlRowFeatureConfig>,
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

@customElement("bold-media-player-control-row")
export class BoldMediaPlayerControlRowFeature extends CustomLovelaceCardFeature<
  MediaPlayerEntity,
  BoldMediaPlayerControlRowFeatureConfig
> {
  public static async getConfigElement(): Promise<LovelaceCardFeatureEditor> {
    await import(
      "../../editors/features/media-player-control-row-feature/bold-media-player-control-row-feature-editor"
    );
    return document.createElement(
      "bold-media-player-control-row-feature-editor",
    ) as LovelaceCardFeatureEditor;
  }

  static getStubConfig(): BoldMediaPlayerControlRowFeatureConfig {
    return {
      type: "custom:bold-media-player-control-row",
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.SHUFFLE_SET,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PREVIOUS_TRACK,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PLAY,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_PAUSE,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.MEDIA_NEXT_TRACK,
        },
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.REPEAT_SET,
        },
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

BoldMediaPlayerControlRowFeature.registerCustomFeature<
  MediaPlayerEntity,
  BoldMediaPlayerControlRowFeatureConfig
>({
  type: "bold-media-player-control-row",
  name: "Media Player Control Row",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (config, stateObj) => getFeatureSize(config, stateObj),
  configurable: false,
});
