import { BoldCardType } from "../../lib/cards/types";
import { customElement, state } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldLovelaceCard } from "../base";
import { BoldAtAGlanceCardConfig } from "./types";
import { css, html, nothing } from "lit";
import { TemplatedConfigListRenderer } from "../../lib/templates/templated-config-renderer";
import { GlancePageConfig, GlancePageType } from "../../lib/at-a-glance/types";
import { PropertyValues } from "@lit/reactive-element";
import { styleMap } from "lit-html/directives/style-map";
import { Position } from "../../lib/layout/position";

const cardType = BoldCardType.AT_A_GLANCE;

@customElement(stripCustomPrefix(cardType))
export class BoldAtAGlanceCard extends BoldLovelaceCard<BoldAtAGlanceCardConfig> {
  @state() private _pages: GlancePageConfig[] = [];

  private pagesRenderer?: TemplatedConfigListRenderer<GlancePageConfig>;

  constructor() {
    super();
    import("../../components/glance");
  }

  static get cardType() {
    return cardType;
  }

  public static getStubConfig(): BoldAtAGlanceCardConfig {
    return {
      type: this.cardType,
    };
  }

  public getCardSize() {
    return Number(this._config?.grid_options?.columns) || 2;
  }

  public getGridOptions() {
    return {
      columns: 12,
      rows: this.getCardSize(),
      min_columns: 6,
      min_rows: 2,
    };
  }

  public connectedCallback() {
    super.connectedCallback();

    this.pagesRenderer = this.getGlancePagesRenderer(true);

    this.pagesRenderer.subscribe((list) => {
      this._pages = list.filter((it) => {
        if (it.type !== GlancePageType.CUSTOM) {
          return true;
        }
        return it.visibility ?? true;
      });
    });
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    this.pagesRenderer?.destroy();
  }

  public willUpdate(changedProps: PropertyValues) {
    super.willUpdate(changedProps);

    if (changedProps.has("_config") && this.pagesRenderer) {
      this.pagesRenderer.setList(this._config?.pages);
    }
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    return html`
      <bc-carousel
        style=${styleMap({
          "--ha-card-border-radius": 0,
        })}
        .length=${this._pages.length}
        .getKey=${(index: number) => this._pages[index].type + index}
        .getElement=${(index: number) => html`
          <bc-glance-page
            .config=${this._pages[index]}
            .hass=${this.hass}
          ></bc-glance-page>
        `}
        position=${Position.BOTTOM_LEFT}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
      }

      bc-carousel {
        margin: 0 16px;
        flex: 1;
        --stepper-y-offset: 24px;
      }
    `;
  }
}

BoldAtAGlanceCard.registerCustomCard({
  name: "At a glance card",
  description: "Display any data in a concise way.",
  preview: false,
});
