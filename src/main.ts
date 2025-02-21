import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import {
  ActionHandlerEvent,
  handleAction,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
} from "custom-card-helpers";
import { MediaPlayerTileConfig } from "./types/tile";
import { LovelaceGridOptions } from "./types/lovelace";

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "media-player-tile",
  name: "Media Player Tile",
  description: "A template custom card for you to create something awesome",
});

@customElement("media-player-tile")
export class MediaPlayerTileCard extends LitElement implements LovelaceCard {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor");
    return document.createElement(
      "media-player-tile-editor",
    ) as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: MediaPlayerTileConfig;

  public setConfig(config: MediaPlayerTileConfig): void {
    // TODO: actually validate the config
    if (!config) {
      throw new Error("Invalid configuration");
    }

    this._config = config;
  }

  public getCardSize(): number {
    return 1;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 6,
      rows: 1,
      min_columns: 6,
      min_rows: 1,
    };
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const entityId = this._config.entity;
    const stateObj = entityId ? this.hass.states[entityId] : undefined;

    if (!stateObj) {
      // TODO show error or something
      return nothing;
    }

    const name = this._config.name || stateObj.attributes.friendly_name;
    const stateDisplay = html`
      <state-display
        .stateObj=${stateObj}
        .hass=${this.hass}
        .content=${this._config.state_content}
        .name=${this._config.name}
      >
      </state-display>
    `;

    return html`
      <ha-card>
        <div
          class="background"
          @action=${this._handleAction}
          role="button"
          aria-labelledby="info"
        >
          <ha-ripple></ha-ripple>
        </div>
        <div class="container">
          <div class="content">
            <ha-tile-icon>
              <ha-state-icon
                slot="icon"
                .icon=${this._config.icon}
                .stateObj=${stateObj}
                .hass=${this.hass}
              ></ha-state-icon>
            </ha-tile-icon>
            <ha-tile-info
              id="info"
              .primary=${name}
              .secondary=${stateDisplay}
            ></ha-tile-info>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this._config && ev.detail.action) {
      handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --tile-color: var(--primary-color);
        -webkit-tap-highlight-color: transparent;
      }

      [role="button"] {
        cursor: pointer;
        pointer-events: auto;
      }

      [role="button"]:focus {
        outline: none;
      }

      .background {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        border-radius: var(--ha-card-border-radius, 12px);
        margin: calc(-1 * var(--ha-card-border-width, 1px));
        overflow: hidden;
      }

      .container {
        margin: calc(-1 * var(--ha-card-border-width, 1px));
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .content {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        pointer-events: none;
        gap: 10px;
      }

      ha-tile-icon {
        --tile-icon-color: var(--tile-color);
        position: relative;
        padding: 6px;
        margin: -6px;
      }
    `;
  }
}
