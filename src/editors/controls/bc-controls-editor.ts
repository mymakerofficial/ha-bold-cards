import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators";
import { repeat } from "lit-html/directives/repeat";
import { mdiDelete, mdiDrag, mdiPlus } from "@mdi/js";
import { HomeAssistant } from "../../types/ha/lovelace";
import { t } from "../../localization/i18n";
import {
  ControlConfig,
  ControlType,
  MediaButtonAction,
  MediaToggleKind,
} from "../../lib/controls/types";
import {
  getControlIcon,
  getControlKey,
  getControlLabel,
} from "../../lib/controls/helpers";
import { HassEntityBase } from "home-assistant-js-websocket";
import { editorBaseStyles } from "../styles";
import { stopPropagation } from "../helpers";
import { FeatureInternals } from "../../types/ha/feature";
import { getControlEditorElement } from "./elements/helpers";

const seperator = Symbol("seperator");

@customElement("bc-controls-editor")
export class ControlsEditor extends LitElement {
  @property({ attribute: false }) public controls?: ControlConfig[];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public stateObj?: HassEntityBase;

  @property({ attribute: false })
  public internals?: FeatureInternals;

  constructor() {
    super();
    import("./components/bc-button-config-editor");
    import("./elements/bc-media-button-control-editor");
    import("./elements/bc-media-toggle-control-editor");
    import("./elements/bc-media-position-control-editor");
  }

  private get _availableControls(): (ControlConfig | typeof seperator)[] {
    return [
      ...Object.values(MediaToggleKind).map((kind) => ({
        type: ControlType.MEDIA_TOGGLE,
        kind,
      })),
      seperator,
      ...Object.values(MediaButtonAction).map((action) => ({
        type: ControlType.MEDIA_BUTTON,
        action,
      })),
      seperator,
      {
        type: ControlType.MEDIA_POSITION,
      },
    ];
  }

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
    ev.preventDefault();

    const newControl = this._availableControls.filter((it) => it !== seperator)[
      ev.detail.index
    ];

    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: [...(this.controls ?? []), newControl],
        },
      }),
    );
  }

  protected _editorTemplate(control: ControlConfig, index: number) {
    const el = getControlEditorElement({
      control,
      hass: this.hass,
      stateObj: this.stateObj,
      internals: this.internals,
      onValueChanged: (ev) => this._handleValueChanged(index, ev),
    });

    return (
      el ??
      html`<div class="placeholder">${t("editor.controls.no_settings")}</div>`
    );
  }

  protected render() {
    return html`
      <div class="container">
        <ha-sortable
          handle-selector=".handle"
          @item-moved=${this._handleItemMoved}
        >
          ${!!this.controls?.length
            ? html`<div class="items">
                ${repeat(
                  this.controls ?? [],
                  getControlKey,
                  (control, index) =>
                    html` <div class="item">
                      <ha-expansion-panel outlined>
                        <h3 class="header" slot="header">
                          <ha-icon
                            icon=${getControlIcon(control, this.stateObj)}
                          ></ha-icon>
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
                          ${this._editorTemplate(control, index)}
                        </div>
                      </ha-expansion-panel>
                    </div>`,
                )}
              </div>`
            : html`<div class="placeholder">
                ${t("editor.controls.no_controls")}
              </div>`}
        </ha-sortable>
        <ha-button-menu
          fixed
          @action=${this._handleAddControl}
          @closed=${stopPropagation}
        >
          <ha-button slot="trigger" outlined .label=${t("editor.controls.add")}>
            <ha-svg-icon .path=${mdiPlus} slot="icon"></ha-svg-icon>
          </ha-button>
          ${this._availableControls.map((control) => {
            if (control === seperator) {
              return html`<li divider role="separator"></li>`;
            }
            return html`<ha-list-item .value=${control}>
              <ha-icon icon=${getControlIcon(control)}></ha-icon>
              ${getControlLabel(control)}
            </ha-list-item>`;
          })}
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

      li[divider] {
        border-bottom-color: var(--divider-color);
      }

      .placeholder {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
      }
    `,
  ];
}
