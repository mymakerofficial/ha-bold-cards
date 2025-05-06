import { LovelaceGenericElementEditor } from "../types/ha/lovelace";
import { CSSResultGroup, LitElement } from "lit";
import { property, state } from "lit/decorators";
import { assert, Struct } from "superstruct";
import { editorBaseStyles } from "./styles";
import { LovelaceConfig } from "custom-card-helpers";
import { BoldHassElement } from "../components/hass-element";
import { Optional } from "../lib/types";

export abstract class BoldLovelaceEditor<TConfig extends {}, TContext = any>
  extends BoldHassElement
  implements LovelaceGenericElementEditor<TConfig, TContext>
{
  @property({ attribute: false }) public lovelace?: LovelaceConfig;

  @property({ attribute: false }) public context?: TContext;

  @state() protected _config?: TConfig;

  protected abstract get _struct(): Struct<any, any>;

  public setConfig(config: TConfig): void {
    assert(config, this._struct);
    this._config = config;
  }

  // forces the parent to update the editor
  protected _reload() {
    // @ts-ignore
    (this.getRootNode() as Optional<ShadowRoot>)?.host?._updateConfigElement();
  }

  protected _changeConfig(config: TConfig) {
    this.fireEvent("config-changed", { config });
  }

  protected _patchConfig(config: Partial<TConfig>) {
    if (!this._config) {
      return;
    }

    this._changeConfig({
      ...this._config,
      ...config,
    });
  }

  protected _setField<TField extends keyof TConfig>(
    field: TField,
    value: TConfig[TField],
  ) {
    if (!this._config) {
      return;
    }

    const newConfig = {
      ...this._config,
    };

    newConfig[field] = value;

    this.fireEvent("config-changed", { config: newConfig });
  }

  protected _handleValueChanged<TField extends keyof TConfig>(
    field: TField,
    ev: CustomEvent<{ value: TConfig[TField] }>,
  ) {
    this._setField(field, ev.detail.value);
  }

  static styles: CSSResultGroup = editorBaseStyles;
}
