import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import {
  HomeAssistant,
  LovelaceCardFeatureEditorContext,
} from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import {
  CustomCardFeatureEntry,
  LovelaceCardFeatureConfig,
} from "../../types/ha/feature";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPencil } from "@mdi/js";
import { editorBaseStyles } from "../styles";
import { fireEvent } from "custom-card-helpers";
import { getCardFeatureInternals } from "../../cards/features";
import { LovelaceCardConfigWithFeatures } from "../../types/card";

function getCustomFeatureEntries() {
  return (
    ((window as any).customCardFeatures as
      | CustomCardFeatureEntry[]
      | undefined) ?? []
  ).reduce((acc, entry) => {
    acc[entry.type] = entry;
    return acc;
  }, {}) as Record<string, CustomCardFeatureEntry>;
}

@customElement("bc-card-features-editor")
export class BoldCardFeatureEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @property({ attribute: false }) public stateObj?: HassEntity;

  @property({ attribute: false })
  public config?: LovelaceCardConfigWithFeatures;

  protected get _features(): LovelaceCardFeatureConfig[] {
    return this.config?.features ?? [];
  }

  private _getFeatureTypeLabel(type: string) {
    if (isCustomType(type)) {
      const customType = stripCustomPrefix(type);
      const customFeatureEntry = getCustomFeatureEntries()[customType];
      return customFeatureEntry?.name || type;
    }
    return (
      this.hass!.localize(
        `ui.panel.lovelace.editor.features.types.${type}.label`,
      ) || type
    );
  }

  protected render() {
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
                      <span>${this._getFeatureTypeLabel(feature.type)}</span>
                    </div>
                  </div>
                  <ha-icon-button
                    .label=${this.hass!.localize(
                      `ui.panel.lovelace.editor.features.edit`,
                    )}
                    .path=${mdiPencil}
                    class="edit-icon"
                    @click=${() => this._editFeature(index)}
                  ></ha-icon-button>
                  <ha-icon-button
                    .label=${this.hass!.localize(
                      `ui.panel.lovelace.editor.features.remove`,
                    )}
                    .path=${mdiDelete}
                    class="remove-icon"
                    .index=${index}
                    @click=${() => {}}
                  ></ha-icon-button>
                </div>`,
            )}
          </div>
        </ha-sortable>
      </div>
    `;
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

export const isCustomType = (type: string) => type.startsWith("custom:");

export const stripCustomPrefix = (type: string) => type.slice("custom:".length);
