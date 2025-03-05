import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { HomeAssistant } from "../../types/ha/lovelace";
import { HassEntity } from "home-assistant-js-websocket";
import {
  CustomCardFeatureEntry,
  LovelaceCardFeatureConfig,
} from "../../types/ha/feature";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPencil } from "@mdi/js";
import { editorBaseStyles } from "../styles";
import { fireEvent } from "custom-card-helpers";

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

  @property({ attribute: false }) public features?: LovelaceCardFeatureConfig[];

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
              this.features ?? [],
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
    if (!this.features) {
      return;
    }

    const config = this.features[index];

    fireEvent(this, "edit-sub-element" as any, {
      config: config,
      saveConfig: (newConfig) => this._handleFeatureSaved(index, newConfig),
      context: {
        entity_id: this.stateObj?.entity_id,
        internals: {
          // TODO actually compute this
          parent_card_type: "custom:bold-media-player-card",
        },
      },
      type: "feature",
    });
  }

  private _handleFeatureSaved(
    index: number,
    newConfig: LovelaceCardFeatureConfig,
  ) {
    if (!this.features) {
      return;
    }

    const features = [...this.features!];
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

    if (!this.features) {
      return;
    }

    const features = [...this.features];
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
