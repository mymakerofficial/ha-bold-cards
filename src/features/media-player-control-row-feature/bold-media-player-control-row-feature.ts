import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerControlRowFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import {
  ButtonSize,
  ButtonVariant,
  limitButtonSize,
} from "../../components/bc-button";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { styleMap } from "lit-html/directives/style-map";
import { FeatureConfigWithMaybeInternals } from "../../types/ha/feature";

import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaToggleKind,
} from "../../lib/controls/types";
import { translateControls } from "../../lib/controls/helpers";
import { LovelaceCardFeatureEditor } from "../../types/ha/lovelace";
import { classMap } from "lit-html/directives/class-map";
import { firstOf, lastOf } from "../../lib/helpers";
import { mediaButtonControlDefaultMaps } from "../../lib/controls/constants";

function getControls(
  config: FeatureConfigWithMaybeInternals<BoldMediaPlayerControlRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  return translateControls({
    controls: config.controls,
    stateObj,
    mediaButtonDefaultMap: config.__custom_internals
      ? undefined
      : mediaButtonControlDefaultMaps.small,
  }).map((control) => {
    if (control.type === ControlType.MEDIA_BUTTON) {
      return {
        ...control,
        size: config.__custom_internals ? control.size : ButtonSize.SM,
      };
    }
    return control;
  });
}

function getFeatureSize(
  config: FeatureConfigWithMaybeInternals<BoldMediaPlayerControlRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  const controls = getControls(config, stateObj);

  if (!controls.length) {
    return 0;
  }

  if (
    config.when_unavailable === ElementWhenUnavailable.HIDE &&
    controls.every((it) => it.disabled)
  ) {
    return 0;
  }

  const hasLargeButtons = controls.some((it) => {
    if (it.type === ControlType.MEDIA_BUTTON) {
      return it.size === ButtonSize.LG || it.size === ButtonSize.XL;
    }
    return false;
  });

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
          type: ControlType.MEDIA_TOGGLE,
          kind: MediaToggleKind.PLAY_PAUSE,
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

    const firstControl = firstOf(this._controls);
    const lastControl = lastOf(this._controls);

    return html`
      <div
        class="container ${classMap({
          "inset-left":
            firstControl?.type === ControlType.MEDIA_BUTTON &&
            firstControl.variant === ButtonVariant.PLAIN,
          "inset-right":
            lastControl?.type === ControlType.MEDIA_BUTTON &&
            lastControl.variant === ButtonVariant.PLAIN,
        })}"
        style=${styleMap({
          "--feature-size": this._featureSize,
        })}
      >
        <bc-control-row
          center=${true}
          .hass=${this.hass}
          .stateObj=${this.stateObj}
          .controls=${this._controls}
        ></bc-control-row>
      </div>
    `;
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(
          var(--feature-height) * var(--feature-size) + var(--feature-padding) *
            (var(--feature-size) - 1)
        );
      }

      bc-control-row {
        --button-row-gap: 8px;
        flex: 1;
      }

      .inset-left {
        /* make the icon align and not the border of the button */
        margin-left: calc(-1 * var(--card-padding, 10px) + 6px);
      }

      .inset-right {
        /* make the icon align and not the border of the button */
        margin-right: calc(-1 * var(--card-padding, 10px) + 6px);
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
  configurable: true,
});
