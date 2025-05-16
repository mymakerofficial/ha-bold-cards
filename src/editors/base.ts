import { LovelaceGenericElementEditor } from "../types/ha/lovelace";
import { CSSResultGroup, html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators";
import { assert, Struct } from "superstruct";
import { editorBaseStyles } from "./styles";
import { LovelaceConfig } from "custom-card-helpers";
import { BoldHassElement } from "../components/hass-element";
import { Maybe, MaybeFunction, RenderResult } from "../lib/types";
import { isEmpty, isUndefined, lastOf, resolve } from "../lib/helpers";
import { t } from "../localization/i18n";
import { Optional } from "../lib/optional";
import { run } from "../lib/result";

type HuiCardElementEditor = LitElement & {
  _updateConfigElement?: () => void;
};

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
  protected forceReloadEditor() {
    return run(() => {
      const shadowRoot = Optional.of(
        this.getRootNode() as Maybe<ShadowRoot>,
      ).getOrThrow("No shadow root found");
      const host = Optional.of(
        shadowRoot.host as Maybe<HuiCardElementEditor>,
      ).getOrThrow("host element not found");
      if (
        host.tagName !== "HUI-CARD-ELEMENT-EDITOR" ||
        isUndefined(host._updateConfigElement)
      ) {
        throw new Error("host element was did not have the correct type");
      }
      host._updateConfigElement();
    }).mapError((error) => `Reloading editor failed: ${error.message}`);
  }

  protected changeConfig(config: TConfig) {
    this.fireEvent("config-changed", { config });
  }

  protected patchConfig(config: Partial<TConfig>) {
    if (!this._config) {
      return;
    }

    this.changeConfig({
      ...this._config,
      ...config,
    });
  }

  protected setField<TField extends keyof TConfig>(
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

  protected handleValueChanged<TField extends keyof TConfig>(
    field: TField,
    ev: CustomEvent<{ value: TConfig[TField] }>,
  ) {
    this.setField(field, ev.detail.value);
  }

  protected handleFormValueChanged(
    ev: CustomEvent<{ value: Partial<TConfig> }>,
  ) {
    this.patchConfig(ev.detail.value);
  }

  static styles: CSSResultGroup = editorBaseStyles;
}

type SubEditorDefinition = {
  title: MaybeFunction<string>;
  showHeader?: MaybeFunction<boolean>;
  showBack?: MaybeFunction<boolean>;
  renderHeaderActions?: () => RenderResult;
  render: () => RenderResult;
};

export abstract class BoldLovelaceEditorWithSubEditor<
  TConfig extends {},
  TContext = any,
> extends BoldLovelaceEditor<TConfig, TContext> {
  @state() private _subEditorStack: SubEditorDefinition[] = [];

  private _renderSubEditorHeader({
    title,
    showBack,
    renderHeaderActions,
  }: Pick<SubEditorDefinition, "title" | "showBack" | "renderHeaderActions">) {
    return html`
      <div class="sub-header">
        ${resolve(showBack ?? true)
          ? html`<ha-icon-button-prev
              .label=${t("editor.common.label.back")}
              @click=${(ev) => {
                ev.stopPropagation();
                this.closeSubEditor();
              }}
            ></ha-icon-button-prev>`
          : nothing}
        <span class="title">${title}</span>
        ${renderHeaderActions
          ? html`<div class="actions">${renderHeaderActions()}</div>`
          : nothing}
      </div>
    `;
  }

  private _renderSubEditor({
    showHeader,
    render,
    ...def
  }: SubEditorDefinition) {
    return html`
      <div class="sub-editor">
        ${resolve(showHeader ?? true)
          ? this._renderSubEditorHeader(def)
          : nothing}
        ${render()}
      </div>
    `;
  }

  protected openSubEditor(def: SubEditorDefinition): void {
    this._subEditorStack.push(def);
    this.requestUpdate();
  }

  protected closeSubEditor(): void {
    this._subEditorStack.pop();
    this.requestUpdate();
  }

  protected renderWithSubEditor(renderFn: () => RenderResult) {
    if (!isEmpty(this._subEditorStack)) {
      const def = lastOf(this._subEditorStack)!;
      return this._renderSubEditor(def);
    }
    return renderFn();
  }

  protected renderWith(renderFn: () => RenderResult) {
    return super.renderWith(() => this.renderWithSubEditor(renderFn));
  }
}
