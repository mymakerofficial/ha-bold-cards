import { css, html, LitElement, nothing } from "lit";
import { customElement, property } from "lit/decorators";
import {
  HomeAssistant,
  LovelaceCardFeatureEditorContext,
} from "../../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { LovelaceCardFeatureConfig } from "../../../types/ha/feature";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPencil, mdiPlus } from "@mdi/js";
import { editorBaseStyles } from "../../styles";
import { fireEvent } from "custom-card-helpers";
import { getCardFeatureInternals } from "../../../cards/features";
import { LovelaceCardConfigWithFeatures } from "../../../types/card";
import {
  getFeatureStubConfig,
  getFeatureTypeLabel,
  getFeatureTypes,
  getIsFeatureTypeEditable,
} from "./helpers";
import { stopPropagation } from "../../helpers";
import { t } from "../../../localization/i18n";

@customElement("bc-card-features-editor")
export class BoldCardFeatureEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @property({ attribute: false })
  public config?: LovelaceCardConfigWithFeatures;

  protected get _features(): LovelaceCardFeatureConfig[] {
    return this.config?.features ?? [];
  }

  protected _getAvailableFeatures() {
    return getFeatureTypes();
  }

  protected render() {
    const availableFeatures = this._getAvailableFeatures();

    return html`
      <div class="container">
        <ha-sortable
          handle-selector=".handle"
          @item-moved=${this._handleFeatureMoved}
        >
          <div class="items">
            ${repeat(
              this._features ?? [],
              (feature, index) => feature.type + index,
              (feature, index) =>
                html` <div class="item">
                  <div class="handle">
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <div class="content">
                    <div>
                      <span
                        >${getFeatureTypeLabel(feature.type, this.hass)}</span
                      >
                    </div>
                  </div>
                  ${getIsFeatureTypeEditable(feature.type)
                    ? html`
                        <ha-icon-button
                          .label=${this.hass!.localize(
                            `ui.panel.lovelace.editor.features.edit`,
                          )}
                          .path=${mdiPencil}
                          class="edit-icon"
                          @click=${() => this._editFeature(index)}
                        ></ha-icon-button>
                      `
                    : nothing}
                  <ha-icon-button
                    .label=${this.hass!.localize(
                      `ui.panel.lovelace.editor.features.remove`,
                    )}
                    .path=${mdiDelete}
                    class="remove-icon"
                    .index=${index}
                    @click=${() => this._handleFeatureRemoved(index)}
                  ></ha-icon-button>
                </div>`,
            )}
          </div>
        </ha-sortable>
        <ha-button-menu
          fixed
          @action=${this._handleAddFeature}
          @closed=${stopPropagation}
        >
          <ha-button slot="trigger" outlined .label=${t("editor.features.add")}>
            <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
          </ha-button>
          ${availableFeatures.map((feature) => {
            return html`<ha-list-item .value=${feature}>
              ${getFeatureTypeLabel(feature, this.hass)}
            </ha-list-item>`;
          })}
        </ha-button-menu>
      </div>
    `;
  }

  private _handleAddFeature(ev: CustomEvent) {
    if (!this.config || !this.hass) {
      return;
    }

    const index = ev.detail.index as number;

    if (!index) {
      return;
    }

    const feature = this._getAvailableFeatures()[index];

    if (!feature) {
      return;
    }

    const newFeatureConfig = getFeatureStubConfig(
      feature,
      this.hass,
      this.stateObj,
    );

    const features = [...this._features, newFeatureConfig];

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: features,
        },
      }),
    );
  }

  private _editFeature(index: number) {
    if (!this.config) {
      return;
    }

    const features = this._features;

    if (!features) {
      return;
    }

    const config = features[index];

    const context: LovelaceCardFeatureEditorContext = {
      entity_id: this.stateObj?.entity_id,
      internals: getCardFeatureInternals({
        config: this.config,
        featureIndex: index,
        feature: config,
        features,
      }),
    };

    fireEvent(this, "edit-sub-element" as any, {
      config,
      saveConfig: (newConfig) => this._handleFeatureSaved(index, newConfig),
      context,
      type: "feature",
    });
  }

  private _handleFeatureSaved(
    index: number,
    newConfig: LovelaceCardFeatureConfig,
  ) {
    const features = [...this._features];
    features[index] = newConfig;

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: features,
        },
      }),
    );
  }

  private _handleFeatureRemoved(index: number) {
    const features = [...this._features];
    features.splice(index, 1);

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: features,
        },
      }),
    );
  }

  private _handleFeatureMoved(ev: CustomEvent) {
    ev.stopPropagation();

    const features = [...this._features];
    const [movedFeature] = features.splice(ev.detail.oldIndex, 1);
    features.splice(ev.detail.newIndex, 0, movedFeature);

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
        gap: 8px;
      }

      .item .handle {
        cursor: move; /* fallback if grab cursor is unsupported */
        cursor: grab;
        padding: 12px;
        direction: var(--direction);
      }

      .item .handle > * {
        pointer-events: none;
      }

      .item {
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: none;
        border-width: 1px;
        border-style: solid;
        border-color: var(--outline-color);
        border-radius: 6px;
      }

      .content {
        flex: 1;
      }
    `,
  ];
}
