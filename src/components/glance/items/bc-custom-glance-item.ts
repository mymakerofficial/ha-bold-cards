import { BcGlanceItemBase } from "./base";
import {
  CustomGlanceItemConfig,
  GlanceItemConfig,
} from "../../../lib/at-a-glance/types";
import { nothing } from "lit";
import { customElement } from "lit/decorators.js";
import { TemplateRendererState } from "../../../lib/templates/templated-config-renderer";

@customElement("bc-custom-glance-item")
export class BcCustomGlanceItem extends BcGlanceItemBase<CustomGlanceItemConfig> {
  protected getItem(config: GlanceItemConfig) {
    return config as CustomGlanceItemConfig;
  }

  render() {
    if (!this._item) {
      return nothing;
    }

    return this._baseTemplate({
      content: this._item.content,
      contentIsPending:
        this._itemRenderer?.state.get("content") ===
        TemplateRendererState.PENDING,
      icon: this._item.icon,
      iconIsPending:
        this._itemRenderer?.state.get("icon") === TemplateRendererState.PENDING,
    });
  }
}
