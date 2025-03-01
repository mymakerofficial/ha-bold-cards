import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistant } from "../../types/ha/lovelace";
import { t } from "../../localization/i18n";
import {
  MediaButtonControlConfig,
  MediaButtonWhenUnavailable,
} from "../../lib/controls/types";
import { editorBaseStyles } from "../styles";
import { MediaPlayerEntity } from "../../types/ha/entity";
import {
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from "../../components/bc-button";

@customElement("bc-media-button-control-editor")
export class MediaButtonControlEditor extends LitElement {
  @property({ attribute: false }) public control?: MediaButtonControlConfig;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: MediaPlayerEntity;

  protected render() {
    const schema = [
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "size",
            required: false,
            selector: {
              select: {
                mode: "dropdown",
                options: Object.values(ButtonSize).map((value) => ({
                  value,
                  label: t(value, {
                    scope: "common.button.size",
                  }),
                })),
              },
            },
          },
          {
            name: "variant",
            required: false,
            selector: {
              select: {
                mode: "dropdown",
                options: Object.values(ButtonVariant).map((value) => ({
                  value,
                  label: t(value, {
                    scope: "common.button.variant",
                  }),
                })),
              },
            },
          },
          {
            name: "shape",
            required: false,
            selector: {
              select: {
                mode: "dropdown",
                options: Object.values(ButtonShape).map((value) => ({
                  value,
                  label: t(value, {
                    scope: "common.button.shape",
                  }),
                })),
              },
            },
          },
          {
            name: "when_unavailable",
            required: false,
            selector: {
              select: {
                mode: "dropdown",
                options: Object.values(MediaButtonWhenUnavailable).map(
                  (value) => ({
                    value,
                    label: t(value, {
                      scope: "common.media_button_when_unavailable",
                    }),
                  }),
                ),
              },
            },
          },
        ],
      },
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.control}
        .schema=${schema}
        .computeLabel=${this._computeLabelCallback}
        .computeHelper=${this._computeHelperCallback}
        @value-changed=${() => {}}
      ></ha-form>
    `;
  }

  private _computeLabelCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.controls.media_button_control.label",
    });
  };

  private _computeHelperCallback = ({ name }: { name: string }) => {
    return t(name, {
      scope: "editor.controls.media_button_control.helper_text",
      defaultValue: "",
    });
  };

  static styles = [editorBaseStyles];
}
