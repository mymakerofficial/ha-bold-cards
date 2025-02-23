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
import { mdiPlay, mdiPower } from "@mdi/js";

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
      rows: 4,
      min_columns: 6,
      min_rows: 4,
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

    // const controls = getMediaControls(stateObj);
    const controls = [
      {
        iconPath: mdiPower,
        action: "turn_off",
      },
      {
        iconPath: mdiPlay,
        action: "media_play",
      },
    ];

    const features = [
      {
        type: "custom:media-player-progress",
      },
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
                <mpt-cover-image .imageUrl=${imageUrl}>
                  <ha-state-icon
                    slot="icon"
                    .stateObj=${stateObj}
                    .hass=${this.hass}
                  ></ha-state-icon>
                </mpt-cover-image>
                <div class="media-info" id="info">
                  <hui-marquee
                    .text=${mediaTitle || mediaDescription}
                    .active=${true}
                    .animating=${true}
                  ></hui-marquee>
                  <span>${mediaDescription}</span>
                </div>
              </div>
            </div>
            <div class="controls">
              ${controls?.map(
                (control) => html`
                  <mpt-large-button
                    .iconPath=${control.iconPath}
                  ></mpt-large-button>
                `,
              )}
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
        --tile-icon-color: var(--tile-color);
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
        bottom: 0;
        right: 0;
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

      .media-info {
        flex: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    `;
  }
}
