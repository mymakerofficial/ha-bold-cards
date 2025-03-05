import {
  HomeAssistant,
  LovelaceCardFeatureEditorContext,
  LovelaceGenericElementEditor,
} from "../types/ha/lovelace";
import { CSSResultGroup, LitElement } from "lit";
import { property, state } from "lit/decorators";
import { assert, Struct } from "superstruct";
import { editorBaseStyles } from "./styles";
import { LovelaceConfig } from "custom-card-helpers";

export abstract class BoldLovelaceEditor<
    TConfig extends {},
    TContext = LovelaceCardFeatureEditorContext,
  >
  extends LitElement
  implements LovelaceGenericElementEditor<TConfig, TContext>
{
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public lovelace?: LovelaceConfig;

  @property({ attribute: false }) public context?: TContext;

  @state() protected _config?: TConfig;

  protected abstract get _struct(): Struct<any, any>;

  public setConfig(config: TConfig): void {
    assert(config, this._struct);
    this._config = config;
  }

  static styles: CSSResultGroup = editorBaseStyles;
}
