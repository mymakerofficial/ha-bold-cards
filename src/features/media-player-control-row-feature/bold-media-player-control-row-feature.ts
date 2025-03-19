import { customElement } from "lit/decorators";
import { css, html, nothing } from "lit";
import { BoldMediaPlayerControlRowFeatureConfig } from "./types";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { ButtonSize, ButtonVariant } from "../../components/bc-button";
import { computeDomain } from "../../helpers/entity";
import { CustomLovelaceCardFeature } from "../base";
import { styleMap } from "lit-html/directives/style-map";

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
import { getDefaultConfigTypeFromFeatureInternals } from "../../lib/features/helpers";
import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";
import { BoldFeatureType } from "../../lib/features/types";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldCardType } from "../../lib/cards/types";

function getControls(
  config: FeatureConfigWithMaybeInternals<BoldMediaPlayerControlRowFeatureConfig>,
  stateObj: MediaPlayerEntity,
) {
  return translateControls({
    controls: config.controls,
    stateObj,
    defaultType: getDefaultConfigTypeFromFeatureInternals(
      config.__bold_custom_internals,
    ),
  }).map((control) => {
    if (control.type === ControlType.MEDIA_BUTTON) {
      return {
        ...control,
        size: config.__bold_custom_internals ? control.size : ButtonSize.SM,
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
    controls
      .filter((it) => it.type !== ControlType.SPACER)
      .every((it) => it.disabled)
  ) {
    return 0;
  }

  const hasLargeButtons = controls.some((it) => {
    if (it.type === ControlType.MEDIA_BUTTON) {
      return it.size === ButtonSize.LG || it.size === ButtonSize.XL;
    }
    return false;
  });

  return hasLargeButtons ? 1.5 : 1;
}

const featureType = BoldFeatureType.MEDIA_PLAYER_CONTROL_ROW;

@customElement(stripCustomPrefix(featureType))
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

  static get featureType() {
    return featureType;
  }

  static getStubConfig(): BoldMediaPlayerControlRowFeatureConfig {
    return {
      type: this.featureType,
      controls: [
        {
          type: ControlType.MEDIA_BUTTON,
          action: MediaButtonAction.SHUFFLE_SET,
          unavailable_when_off: true,
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
          unavailable_when_off: true,
        },
      ],
    };
  }

  protected _getControls() {
    return getControls(this._config!, this.stateObj!);
  }

  render() {
    if (!this._config || !this.hass || !this.stateObj) {
      return nothing;
    }

    if (!this.getDoesRender()) {
      return nothing;
    }

    const controls = this._getControls();
    const firstControl = firstOf(controls);
    const lastControl = lastOf(controls);

    const size = this.getSize();

    const insetLeft =
      (firstControl?.type === ControlType.MEDIA_BUTTON &&
        firstControl.variant === ButtonVariant.PLAIN &&
        firstControl.size === ButtonSize.SM) ??
      false;
    const insetRight =
      (lastControl?.type === ControlType.MEDIA_BUTTON &&
        lastControl.variant === ButtonVariant.PLAIN &&
        lastControl.size === ButtonSize.SM) ??
      false;
    const insetBottom =
      (size === 1 &&
        this.boldInternals?.parent_card_type === BoldCardType.MEDIA_PLAYER,
      !this.boldInternals?.is_inlined && this.boldInternals?.is_last) ?? false;

    return html`
      <div
        class=${classMap({
          container: true,
          "inset-left": insetLeft,
          "inset-right": insetRight,
          "inset-bottom": insetBottom,
        })}
        style=${styleMap({
          "--feature-size": size,
        })}
      >
        <bc-control-row
          center=${true}
          .hass=${this.hass}
          .stateObj=${this.stateObj}
          .controls=${controls}
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
        /* don't actually set the height to fit the grid, this way the gaps are consistent */
        /* height: calc(
            var(--feature-height) * var(--feature-size) + var(--feature-gap) *
              (var(--feature-size) - 1)
           ); */
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

      .inset-bottom {
        margin-bottom: calc(-1 * var(--card-padding, 10px) / 2);
        height: calc(var(--feature-height) - var(--card-padding, 10px) / 2);
      }
    `;
  }
}

BoldMediaPlayerControlRowFeature.registerCustomFeature<
  MediaPlayerEntity,
  BoldMediaPlayerControlRowFeatureConfig
>({
  name: "Media Player Control Row",
  supported: (stateObj) => computeDomain(stateObj.entity_id) === "media_player",
  getSize: (config, stateObj) => getFeatureSize(config, stateObj),
  configurable: true,
});
