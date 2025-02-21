import { LitElement, html, TemplateResult, css, CSSResultGroup } from "lit";
import {
  HomeAssistant,
  fireEvent,
  LovelaceCardEditor,
} from "custom-card-helpers";
import { MediaPlayerTileConfig } from "./types/tile";
import { customElement, property, state } from "lit/decorators";
import { assert } from "superstruct";
import { cardConfigStruct } from "./struct";

@customElement("media-player-tile-editor")
export class MediaPlayerTileEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: MediaPlayerTileConfig;

  public setConfig(config: MediaPlayerTileConfig): void {
    assert(config, cardConfigStruct);
    this._config = config;
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    const schema = [{ name: "entity", selector: { entity: {} } }];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !this.hass) {
      return;
    }

    const newConfig = ev.detail.value as MediaPlayerTileConfig;

    const config: MediaPlayerTileConfig = {
      features: this._config.features,
      ...newConfig,
    };

    if (config.hide_state) {
      delete config.state_content;
    }

    if (!config.state_content) {
      delete config.state_content;
    }

    // Convert content_layout to vertical
    if (config.content_layout) {
      config.vertical = config.content_layout === "vertical";
      delete config.content_layout;
    }

    fireEvent(this, "config-changed", { config });
  }

  static styles: CSSResultGroup = css``;
}
