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
} from "../../lib/controls/types";
import { getControlIcon, getControlLabel } from "../../lib/controls/helpers";
import { HassEntityBase } from "home-assistant-js-websocket";
import { editorBaseStyles } from "../styles";

export class ControlsEditorItemMovedEvent extends CustomEvent<{
  oldIndex: number;
  newIndex: number;
}> {
  constructor(detail: { oldIndex: number; newIndex: number }) {
    super("item-moved", {
      detail,
    });
  }
}

@customElement("bc-controls-editor")
export class ControlsEditor extends LitElement {
  @property({ attribute: false }) public controls?: ControlConfig[];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: HassEntityBase;

  private _handleItemMoved(ev: CustomEvent) {
    this.dispatchEvent(new ControlsEditorItemMovedEvent(ev.detail));
  }

  private _handleAddControl(_ev: CustomEvent) {
    // todo
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
              (control, _index) =>
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
                    ></ha-icon-button>
                    <div class="content">
                      <bc-media-button-control-editor
                        .control=${control as MediaButtonControlConfig}
                        .hass=${this.hass}
                        .stateObj=${this.stateObj}
                      />
                    </div>
                  </ha-expansion-panel>
                </div>`,
            )}
          </div>
        </ha-sortable>
        <ha-button-menu
          fixed
          @action=${() => {}}
          @close=${(ev) => ev.stopPropagation()}
        >
          <ha-button slot="trigger" outlined .label=${t("editor.controls.add")}>
            <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
          </ha-button>
          ${Object.values(MediaButtonAction).map(
            (type) => html`
              <ha-list-item .value=${type}>
                ${t(type, { scope: "common.media_control_action" })}
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
    `,
  ];
}
