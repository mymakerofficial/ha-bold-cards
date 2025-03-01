import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { repeat } from "lit-html/directives/repeat";
import { mdiDrag, mdiPlus } from "@mdi/js";
import { ControlConfig, MediaButtonControlConfig } from "../lib/controls";
import { HomeAssistant } from "../types/ha/lovelace";
import { MediaControlAction } from "../helpers/media-player";
import { t } from "../localization/i18n";

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
                  <div class="handle">
                    <ha-svg-icon .path=${mdiDrag}></ha-svg-icon>
                  </div>
                  <div class="content">
                    <ha-svg-icon
                      .path=${(control as MediaButtonControlConfig).icon}
                    ></ha-svg-icon>
                    <div>${(control as MediaButtonControlConfig).action}</div>
                  </div>
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
          ${Object.values(MediaControlAction).map(
            (type) => html`
              <ha-list-item .value=${type}> ${type} </ha-list-item>
            `,
          )}
        </ha-button-menu>
      </div>
    `;
  }

  static styles = css`
    .container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .item {
      display: flex;
      align-items: center;
    }

    .item .handle {
      cursor: move; /* fallback if grab cursor is unsupported */
      cursor: grab;
      padding-right: 8px;
      padding-inline-end: 8px;
      padding-inline-start: initial;
      direction: var(--direction);
    }
    .item .handle > * {
      pointer-events: none;
    }

    .feature-content {
      height: 60px;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
    }

    .feature-content div {
      display: flex;
      flex-direction: column;
    }
  `;
}
