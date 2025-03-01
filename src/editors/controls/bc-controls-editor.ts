import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPlus } from "@mdi/js";
import { HomeAssistant } from "../../types/ha/lovelace";
import { t } from "../../localization/i18n";
import {
  ControlConfig,
  MediaButtonControlConfig,
  MediaButtonAction,
  ControlType,
} from "../../lib/controls/types";
import { getControlIcon, getControlLabel } from "../../lib/controls/helpers";
import { HassEntityBase } from "home-assistant-js-websocket";
import { editorBaseStyles } from "../styles";

@customElement("bc-controls-editor")
export class ControlsEditor extends LitElement {
  @property({ attribute: false }) public controls?: ControlConfig[];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: HassEntityBase;

  private _handleItemMoved(ev: CustomEvent) {
    ev.stopPropagation();

    const newValue = [...this.controls!];
    const [movedItem] = newValue.splice(ev.detail.oldIndex, 1);
    newValue.splice(ev.detail.newIndex, 0, movedItem);

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }

  private _handleValueChanged(index: number, ev: CustomEvent) {
    ev.stopPropagation();

    const newValue = [...this.controls!];
    newValue[index] = ev.detail.value;

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }

  _handleRemoveControl(index: number, ev: CustomEvent) {
    ev.stopPropagation();

    const newValue = [...this.controls!];
    newValue.splice(index, 1);

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: newValue,
        },
      }),
    );
  }

  _handleAddControl(ev: CustomEvent) {
    ev.stopPropagation();

    const action = Object.values(MediaButtonAction)[ev.detail.index];

    const newControl: MediaButtonControlConfig = {
      type: ControlType.MEDIA_BUTTON,
      action,
    };

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: [...(this.controls ?? []), newControl],
        },
      }),
    );
  }

  protected render() {
    return html`
      <div class="container">
        <ha-sortable
          handle-selector=".handle"
          @item-moved=${this._handleItemMoved}
        >
          <div class="items">
            ${repeat(
              this.controls ?? [],
              (control) =>
                control.type + (control as MediaButtonControlConfig).action,
              (control, index) =>
                html` <div class="item">
                  <ha-expansion-panel outlined>
                    <h3 class="header" slot="header">
                      <ha-icon icon=${getControlIcon(control)}></ha-icon>
                      <div>${getControlLabel(control)}</div>
                    </h3>
                    <div class="handle" slot="icons">
                      <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                    </div>
                    <ha-icon-button
                      .path=${mdiDelete}
                      slot="icons"
                      @click=${(ev) => this._handleRemoveControl(index, ev)}
                    ></ha-icon-button>
                    <div class="content">
                      <bc-media-button-control-editor
                        .control=${control as MediaButtonControlConfig}
                        .hass=${this.hass}
                        .stateObj=${this.stateObj}
                        @value-changed=${(ev) =>
                          this._handleValueChanged(index, ev)}
                      />
                    </div>
                  </ha-expansion-panel>
                </div>`,
            )}
          </div>
        </ha-sortable>
        <ha-button-menu
          fixed
          @action=${this._handleAddControl}
          @close=${stopPropagation}
        >
          <ha-button slot="trigger" outlined .label=${t("editor.controls.add")}>
            <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
          </ha-button>
          ${Object.values(MediaButtonAction).map(
            (action) => html`
              <ha-list-item .value=${action}>
                <ha-icon
                  icon=${getControlIcon({
                    type: ControlType.MEDIA_BUTTON,
                    action,
                  })}
                ></ha-icon>
                ${t(action, { scope: "common.media_button_action" })}
              </ha-list-item>
            `,
          )}
        </ha-button-menu>
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

      .items {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .item .handle {
        cursor: move; /* fallback if grab cursor is unsupported */
        cursor: grab;
        padding: 12px;
        margin-left: 8px;
        direction: var(--direction);
      }

      .item .handle > * {
        pointer-events: none;
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

function stopPropagation(ev: Event) {
  ev.stopPropagation();
}
