import { BoldCardType } from "../../lib/cards/types";
import { customElement, state } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldLovelaceCard } from "../base";
import { BoldAtAGlanceCardConfig } from "./types";
import { css, html, nothing } from "lit";
import {
  RenderTemplateError,
  RenderTemplateResult,
} from "../../lib/templates/types";
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { isDefined, isNotNull } from "../../lib/helpers";
import { Nullable } from "../../lib/types";
import { isTemplateError } from "../../lib/templates/helpers";
import { CarouselStepperPosition } from "../../components/bc-carousel";
import { TemplatedConfigListRenderer } from "../../lib/templates/templated-config-renderer";
import { GlancePageConfig, GlancePageType } from "../../lib/at-a-glance/types";
import { PropertyValues } from "@lit/reactive-element";

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

    this.pagesRenderer = new TemplatedConfigListRenderer<GlancePageConfig>(
      (value) => {
        if (value.type === GlancePageType.CUSTOM) {
          return [
            {
              templateKey: "title_template",
              resultKey: "title",
            },
            {
              templateKey: "visibility_template",
              resultKey: "visible",
              transform: (result) => Boolean(result) || result === "on",
            },
          ];
        }
        return undefined;
      },
      this.hass,
    );

    this.pagesRenderer.subscribe((value) => {
      this._pages = value ?? [];
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
        .length=${this._pages.length}
        .getElement=${(index: number) => html`
          <div>
            <h1>
              ${
                // @ts-ignore
                this._pages[index].title
              }
            </h1>
            <bc-glance-page-item
              .icon=${html`<ha-icon icon="mdi:weather-sunny"></ha-icon>`}
              .label=${"the cheese"}
            ></bc-glance-page-item>
          </div>
        `}
        position=${CarouselStepperPosition.LEFT}
      </div>
    `;
  }

  static get styles() {
    return css``;
  }
}

BoldAtAGlanceCard.registerCustomCard({
  name: "At a glance card",
  description: "Display any data in a concise way.",
  preview: false,
});
