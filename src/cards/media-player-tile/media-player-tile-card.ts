import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";
import {
  ActionHandlerEvent,
  fireEvent,
  handleAction,
  hasAction,
  LovelaceCardEditor,
} from "custom-card-helpers";
import { MediaPlayerTileConfig } from "../../types/tile";
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceGridOptions,
} from "../../types/ha/lovelace";
import { actionHandler } from "../../helpers/ha/action-handler-directive";
import { MediaPlayerEntity } from "../../types/ha/entity";
import { PropertyValues } from "lit-element";
import { extractColors } from "../../helpers/extract-color";
import { styleMap } from "lit-html/directives/style-map";
import { mdiPause, mdiSkipNext } from "@mdi/js";

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

  @state() private _foregroundColor?: string;

  @state() private _backgroundColor?: string;

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
      rows: 3,
      min_columns: 6,
      min_rows: 3,
    };
  }

  private get _stateObj(): MediaPlayerEntity | undefined {
    const entityId = this._config!.entity;
    return this.hass!.states[entityId] as MediaPlayerEntity;
  }

  private get _imageUrl() {
    const stateObj = this._stateObj;
    return (
      stateObj?.attributes.entity_picture_local ??
      stateObj?.attributes.entity_picture
    );
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    const stateObj = this._stateObj;

    if (!stateObj) {
      // TODO show error or something
      return nothing;
    }

    const mediaTitle = stateObj.attributes.media_title;
    const mediaDescription = stateObj.attributes.media_artist;
    const imageUrl = this._imageUrl;

    const features = [
      {
        type: "media-player-volume-slider",
      },
    ];

    return html`
      <ha-card
        style=${styleMap({
          "--tile-color": this._foregroundColor || "",
        })}
      >
        <div class="container">
          <div class="content">
            <div class="hero-container">
              <mpt-control-surface
                class="hero-background"
                @action=${this._handleAction}
                .actionHandler=${actionHandler({
                  hasHold: hasAction(this._config!.hold_action),
                  hasDoubleClick: hasAction(this._config!.double_tap_action),
                })}
                role="button"
                aria-labelledby="info"
              ></mpt-control-surface>
              <div class="hero-content">
                <mpt-cover-image .imageUrl=${imageUrl}></mpt-cover-image>
                <ha-tile-info
                  id="info"
                  .primary=${mediaTitle}
                  .secondary=${mediaDescription}
                ></ha-tile-info>
              </div>
            </div>
            <div class="controls">
              <mpt-large-button .iconPath=${mdiPause}></mpt-large-button>
              <mpt-large-button .iconPath=${mdiSkipNext}></mpt-large-button>
            </div>
          </div>
          <hui-card-features
            .hass=${this.hass}
            .stateObj=${stateObj}
            .features=${features}
          ></hui-card-features>
        </div>
      </ha-card>
    `;
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    this._updateColors().then();
  }

  private async _updateColors() {
    if (!this._imageUrl) {
      return;
    }

    const swatches = await extractColors(this.hass!.hassUrl(this._imageUrl));
    this._foregroundColor = swatches.LightVibrant?.hex;
    this._backgroundColor = swatches.DarkMuted?.hex;
  }

  private _handleAction(ev: ActionHandlerEvent) {
    if (this.hass && this._config && ev.detail.action) {
      handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }

  private _handleMoreInfo() {
    fireEvent(this, "hass-more-info", {
      entityId: this._config!.entity,
    });
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        -webkit-tap-highlight-color: transparent;
      }

      ha-card {
        --tile-color: var(--primary-color);
        --state-color: var(--tile-color);
        --state-icon-color: var(--tile-color);
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

      .hero-container {
        position: relative;
        flex: 1;
      }

      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        --control-surface-border-radius: calc(
          var(--ha-card-border-radius, 12px) / 2
        );
      }

      .hero-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
        box-sizing: border-box;
        pointer-events: none;
        padding-right: 12px;
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
        padding: 12px;
        min-width: 0;
        box-sizing: border-box;
      }

      .controls {
        display: flex;
      }

      ha-tile-info {
        flex: 1;
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
