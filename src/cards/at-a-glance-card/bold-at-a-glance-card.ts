import { BoldCardType } from "../../lib/cards/types";
import { customElement, state } from "lit/decorators";
import { stripCustomPrefix } from "../../editors/cards/features/helpers";
import { BoldLovelaceCard } from "../base";
import { BoldAtAGlanceCardConfig } from "./types";
import { html, nothing } from "lit";
import {
  RenderTemplateError,
  RenderTemplateResult,
} from "../../lib/templates/types";
import { UnsubscribeFunc } from "home-assistant-js-websocket";
import { isDefined, isNotNull } from "../../lib/helpers";
import { Nullable } from "../../lib/types";
import { isTemplateError } from "../../lib/templates/helpers";

const cardType = BoldCardType.AT_A_GLANCE;

@customElement(stripCustomPrefix(cardType))
export class BoldAtAGlanceCard extends BoldLovelaceCard<BoldAtAGlanceCardConfig> {
  @state() private _templateError?: RenderTemplateError;

  @state() private _titleTemplateResult?: RenderTemplateResult;
  @state() private _contentTemplateResult?: RenderTemplateResult;

  private _unsubTitleRenderTemplate: Nullable<Promise<UnsubscribeFunc>> = null;
  private _unsubContentRenderTemplate: Nullable<Promise<UnsubscribeFunc>> =
    null;

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

  protected _getTemplateVariables() {
    return {
      user: this.hass?.user?.name,
    };
  }

  public connectedCallback() {
    super.connectedCallback();

    const titleTemplate = this._config?.title_template;
    const contentTemplate = this._config?.content_template;

    const variables = this._getTemplateVariables();

    if (isDefined(titleTemplate)) {
      this._unsubTitleRenderTemplate = this.subscribeToRenderTemplate({
        onChange: (result) => {
          if (isTemplateError(result)) {
            this._templateError = result;
            return;
          }
          this._titleTemplateResult = result;
        },
        template: titleTemplate,
        variables,
      });
    }

    if (isDefined(contentTemplate)) {
      this._unsubTitleRenderTemplate = this.subscribeToRenderTemplate({
        onChange: (result) => {
          if (isTemplateError(result)) {
            this._templateError = result;
            return;
          }
          this._contentTemplateResult = result;
        },
        template: contentTemplate,
        variables,
      });
    }
  }

  public disconnectedCallback() {
    super.disconnectedCallback();

    if (isNotNull(this._unsubTitleRenderTemplate)) {
      this._unsubTitleRenderTemplate.then((unsub) => unsub());
      this._unsubTitleRenderTemplate = null;
    }

    if (isNotNull(this._unsubContentRenderTemplate)) {
      this._unsubContentRenderTemplate.then((unsub) => unsub());
      this._unsubContentRenderTemplate = null;
    }
  }

  protected render() {
    if (!this._config || !this.hass) {
      return nothing;
    }

    if (this._templateError) {
      return html`
        <ha-alert alertType="error">${this._templateError.error}</ha-alert>
      `;
    }

    return html`
      <div class="content">
        <h1>${this._titleTemplateResult?.result}</h1>
        <div>${this._contentTemplateResult?.result}</div>
      </div>
    `;
  }
}

BoldAtAGlanceCard.registerCustomCard({
  name: "At a glance card",
  description: "Display any data in a concise way.",
  preview: false,
});
