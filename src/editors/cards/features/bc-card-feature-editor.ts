import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LovelaceCardFeatureEditorContext } from "../../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import { LovelaceCardFeatureConfig } from "../../../types/ha/feature";
import { mdiPlus } from "@mdi/js";
import { editorBaseStyles } from "../../styles";
import { getCardFeatureInternals } from "../../../cards/features";
import { LovelaceCardConfigWithFeatures } from "../../../types/card";
import { getFeatureStubConfig, getFeatureTypes } from "./helpers";
import { stopPropagation } from "../../helpers";
import { t } from "../../../localization/i18n";
import { BoldHassElement } from "../../../components/hass-element";
import { SortableListItem } from "../../../components/bc-sortable-list";

@customElement("bc-card-features-editor")
export class BoldCardFeatureEditor extends BoldHassElement {
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
        <bc-sortable-list
          .items=${this._features.map(
            (feature, index): SortableListItem => ({
              label: this.getFeatureTypeLabel(feature.type),
              key: feature.type,
              onEdit: () => this._editFeature(index),
              onRemove: () => this._handleFeatureRemoved(index),
            }),
          )}
          @item-moved=${this._handleFeatureMoved}
        >
          <ha-button-menu
            fixed
            @action=${this._handleAddFeature}
            @closed=${stopPropagation}
          >
            <ha-button
              slot="trigger"
              outlined
              .label=${t("editor.features.add")}
            >
              <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
            </ha-button>
            ${availableFeatures.map((feature) => {
              return html`<ha-list-item .value=${feature}>
                ${this.getFeatureTypeLabel(feature)}
              </ha-list-item>`;
            })}
          </ha-button-menu>
        </bc-sortable-list>
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

    this.fireEvent("edit-sub-element" as any, {
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

  static styles = [editorBaseStyles];
}
