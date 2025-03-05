import { customElement, property } from "lit/decorators";
import { css, html, LitElement, nothing } from "lit";
import { HomeAssistant } from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { LovelaceCardFeatureConfig } from "../../types/ha/feature";
import { repeat } from "lit-html/directives/repeat";
import { mdiButtonPointer } from "@mdi/js";
import { editorBaseStyles } from "../styles";
import { t } from "../../localization/i18n";

@customElement("bc-card-control-features-editor")
export class BoldCardControlFeaturesEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @property({ attribute: false }) public features?: LovelaceCardFeatureConfig[];

  constructor() {
    super();
  }

  protected render() {
    return html`
      <div class="container">
        ${repeat(
          this.features ?? [],
          (feature, index) => feature.type + index,
          (feature, index) => {
            if (feature.type !== "custom:bold-media-player-control-row") {
              return nothing;
            }

            return html` <div class="item">
              <ha-expansion-panel outlined>
                <h3 class="header" slot="header">
                  <ha-svg-icon .path=${mdiButtonPointer}></ha-svg-icon>
                  <div>
                    ${t("editor.card.media_player.label.additional_controls", {
                      count: index + 2,
                    })}
                  </div>
                </h3>
                <div class="content">
                  <bc-controls-editor
                    .hass=${this.hass}
                    .stateObj=${this.stateObj}
                    .controls=${feature.controls}
                    @value-changed=${(ev) =>
                      this._handleControlsChanged(index, ev)}
                  ></bc-controls-editor>
                </div>
              </ha-expansion-panel>
            </div>`;
          },
        )}
      </div>
    `;
  }

  private _handleControlsChanged(featureIndex: number, ev: CustomEvent) {
    ev.stopPropagation();

    if (!this.features || !this.hass) {
      return;
    }

    const features = [...this.features];
    features[featureIndex] = {
      ...features[featureIndex],
      // @ts-ignore
      controls: ev.detail.value,
    };

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: features,
        },
      }),
    );
  }

  static styles = [
    editorBaseStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .items {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .item .header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      ha-list-item ha-icon {
        margin-right: 8px;
      }
    `,
  ];
}
