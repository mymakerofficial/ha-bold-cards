import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import {
  ActionHandlerEvent,
  fireEvent,
  handleAction,
  hasAction,
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
} from "custom-card-helpers";
import { MediaPlayerTileConfig } from "../../types/tile";
import { LovelaceGridOptions } from "../../types/ha/lovelace";
import { mdiDotsVertical, mdiPlay } from "@mdi/js";
import { actionHandler } from "../../helpers/action-handler-directive";

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
    await import("./media-player-tile-editor");
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

    this._config = {
      ...config,
    };
  }

  public getCardSize(): number {
    return 2;
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 6,
      rows: 2,
      min_columns: 6,
      min_rows: 2,
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

    const mediaTitle = stateObj.attributes.media_title;
    const mediaDescription = stateObj.attributes.media_artist;
    const imageUrl = stateObj.attributes.entity_picture;

    return html`
      <ha-card>
        <div
          class="background"
          @action=${this._handleAction}
          .actionHandler=${actionHandler({
            hasHold: hasAction(this._config!.hold_action),
            hasDoubleClick: hasAction(this._config!.double_tap_action),
          })}
          role="button"
          aria-labelledby="info"
        >
          <ha-ripple></ha-ripple>
        </div>
        <div class="container">
          <div class="content">
            <mpt-cover-image .imageUrl=${imageUrl}></mpt-cover-image>
            <ha-tile-info
              id="info"
              .primary=${mediaTitle}
              .secondary=${mediaDescription}
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

  private _handleMoreInfo(): void {
    fireEvent(this, "hass-more-info", {
      entityId: this._config!.entity,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        --tile-color: var(--primary-color);
        -webkit-tap-highlight-color: transparent;
      }

      ha-card:has(.background:focus-visible) {
        --shadow-default: var(--ha-card-box-shadow, 0 0 0 0 transparent);
        --shadow-focus: 0 0 0 1px var(--tile-color);
        border-color: var(--tile-color);
        box-shadow: var(--shadow-default), var(--shadow-focus);
      }

      ha-card {
        --ha-ripple-color: var(--tile-color);
        --ha-ripple-hover-opacity: 0.04;
        --ha-ripple-pressed-opacity: 0.12;
        height: 100%;
        transition:
          box-shadow 180ms ease-in-out,
          border-color 180ms ease-in-out;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      ha-card.active {
        --tile-color: var(--state-icon-color);
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

      .container.horizontal {
        flex-direction: row;
      }

      .content {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 16px;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        pointer-events: none;
        gap: 16px;
      }

      .vertical {
        flex-direction: column;
        text-align: center;
        justify-content: center;
      }

      .vertical ha-tile-info {
        width: 100%;
        flex: none;
      }

      ha-tile-icon {
        --tile-icon-color: var(--tile-color);
        position: relative;
        padding: 6px;
        margin: -6px;
      }

      ha-tile-badge {
        position: absolute;
        top: 3px;
        right: 3px;
        inset-inline-end: 3px;
        inset-inline-start: initial;
      }

      ha-tile-info {
        position: relative;
        min-width: 0;
        transition: background-color 180ms ease-in-out;
        box-sizing: border-box;
      }
    `;
  }
}
