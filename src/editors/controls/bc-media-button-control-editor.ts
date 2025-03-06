import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistant } from "../../types/ha/lovelace";
import { t } from "../../localization/i18n";
import {
  ControlType,
  ElementWhenUnavailable,
  MediaButtonAction,
  MediaButtonControlConfig,
} from "../../lib/controls/types";
import { editorBaseStyles } from "../styles";
import { MediaPlayerEntity } from "../../types/ha/entity";
import {
  getControlIcon,
  getMediaButtonControlDefaultConfig,
} from "../../lib/controls/helpers";
import { enumToOptions } from "../helpers";
import { FeatureInternals } from "../../types/ha/feature";
import { getDefaultConfigTypeFromFeatureInternals } from "../../lib/features/helpers";

@customElement("bc-media-button-control-editor")
export class MediaButtonControlEditor extends LitElement {
  @property({ attribute: false }) public control?: MediaButtonControlConfig;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  @property({ attribute: false })
  public internals?: FeatureInternals;

  protected _handleValueChanged(
    field: keyof MediaButtonControlConfig,
    ev: CustomEvent,
  ) {
    ev.stopPropagation();

    const newValue = {
      ...this.control!,
      [field]: ev.detail.value === "" ? undefined : ev.detail.value,
    };

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }

  protected render() {
    if (
      !this.control ||
      this.control.type !== ControlType.MEDIA_BUTTON ||
      !this.hass
    ) {
      return nothing;
    }

    const defaultConfig = getMediaButtonControlDefaultConfig(
      this.control.action,
      getDefaultConfigTypeFromFeatureInternals(this.internals),
    );

    const allowShowAlways = (
      [
        MediaButtonAction.TURN_OFF,
        MediaButtonAction.TURN_ON,
        MediaButtonAction.MEDIA_PAUSE,
        MediaButtonAction.MEDIA_PLAY,
      ] as string[]
    ).includes(this.control.action);

    return html`
      <div class="container">
        <bc-button-config-editor
          .config=${this.control}
          .hass=${this.hass}
          .defaultConfig=${defaultConfig}
          .iconPlaceholder=${getControlIcon(this.control, this.stateObj)}
          @value-changed=${(ev) =>
            this.dispatchEvent(
              new CustomEvent("value-changed", {
                detail: ev.detail,
              }),
            )}
        >
          <bc-selector-select
            .label=${t(
              "editor.controls.media_button_control.label.when_unavailable",
            )}
            .helper=${t(
              "editor.controls.media_button_control.helper.when_unavailable",
            )}
            .hass=${this.hass}
            .value=${this.control.when_unavailable}
            .default=${defaultConfig.when_unavailable}
            @value-changed=${(ev) =>
              this._handleValueChanged("when_unavailable", ev)}
            .selector=${{
              select: {
                mode: "dropdown",
                options: enumToOptions(ElementWhenUnavailable, {
                  labelScope: "common.element_when_unavailable",
                }),
              },
            }}
          ></bc-selector-select>
        </bc-button-config-editor>
        ${allowShowAlways
          ? html`<ha-selector-boolean
              .label=${t(
                "editor.controls.media_button_control.label.always_show",
              )}
              .helper=${t(
                "editor.controls.media_button_control.helper.always_show",
              )}
              .value=${this.control?.always_show ?? false}
              @value-changed=${(ev) =>
                this._handleValueChanged("always_show", ev)}
            ></ha-selector-boolean>`
          : nothing}
      </div>
    `;
  }

  static styles = [
    editorBaseStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ];
}
