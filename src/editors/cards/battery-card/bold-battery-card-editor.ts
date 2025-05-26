import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { BoldCardType } from "../../../lib/cards/types";
import { getCardEditorTag } from "../../../lib/cards/helpers";
import { BoldLovelaceCardEditor } from "../base";
import { t } from "../../../localization/i18n";
import { BatteryCardConfig } from "../../../cards/battery-card/types";
import { batteryCardConfigStruct } from "../../../cards/battery-card/struct";

@customElement(getCardEditorTag(BoldCardType.BATTERY))
export class BoldBatteryCardEditor extends BoldLovelaceCardEditor<BatteryCardConfig> {
  protected get _struct() {
    return batteryCardConfigStruct;
  }
  protected render() {
    return this.renderWith(() => {
      return html`
        <bc-form-help-box
          .header=${t("editor.card.battery.no_editor.header")}
          .content=${t("editor.card.battery.no_editor.content")}
          .icon=${"mdi:information-outline"}
        ></bc-form-help-box>
      `;
    });
  }
}
