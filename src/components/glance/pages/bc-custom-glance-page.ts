import { BcGlancePageBase } from "./base";
import {
  CustomGlancePageConfig,
  GlancePageConfig,
} from "../../../lib/at-a-glance/types";
import { nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { TemplateRendererState } from "../../../lib/templates/templated-config-renderer";

@customElement("bc-custom-glance-page")
export class BcCustomGlancePage extends BcGlancePageBase<CustomGlancePageConfig> {
  protected getPage(config: GlancePageConfig) {
    return config as CustomGlancePageConfig;
  }

  render() {
    if (!this._page) {
      return nothing;
    }

    return this._baseTemplate({
      label: this._page.title,
      labelIsPending:
        this._pageRenderer?.state.get("title") ===
        TemplateRendererState.PENDING,
      items: this._page.items,
    });
  }
}
