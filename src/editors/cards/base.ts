import {
  LovelaceCardConfig,
  LovelaceCardEditor,
  LovelaceCardEditorContext,
} from "../../types/ha/lovelace";
import { BoldLovelaceEditorWithSubEditor } from "../base";
import { html, nothing } from "lit";
import { t } from "../../localization/i18n";
import { mdiListBox } from "@mdi/js";
import {
  LovelaceCardConfigWithEntity,
  LovelaceCardConfigWithFeatures,
} from "../../types/card";
import { HassEntityBase } from "home-assistant-js-websocket";
import { FeatureConfigWithMaybeInternals } from "../../lib/internals/types";

export abstract class BoldLovelaceCardEditor<TConfig extends LovelaceCardConfig>
  extends BoldLovelaceEditorWithSubEditor<TConfig, LovelaceCardEditorContext>
  implements LovelaceCardEditor
{
  protected get _internals() {
    if (!this.context || typeof this.context !== "object") {
      return undefined;
    }
    return "internals" in this.context ? this.context.internals : undefined;
  }
}

export abstract class BoldLovelaceCardEditorWithEntity<
  TConfig extends LovelaceCardConfigWithEntity,
  TStateObj extends HassEntityBase = HassEntityBase,
> extends BoldLovelaceCardEditor<TConfig> {
  protected get _stateObj() {
    if (!this._config?.entity) {
      return undefined;
    }
    const entityId = this._config.entity;
    return this.hass?.states[entityId] as TStateObj | undefined;
  }
}

export abstract class BoldLovelaceCardEditorWithFeatures<
  TConfig extends LovelaceCardConfigWithFeatures,
  TStateObj extends HassEntityBase = HassEntityBase,
> extends BoldLovelaceCardEditorWithEntity<TConfig, TStateObj> {
  protected constructor() {
    super();
    import("./features/bc-card-feature-editor");
  }

  protected _featureEditorTemplate() {
    if (!this._config) {
      return nothing;
    }

    return html`
      <ha-expansion-panel outlined>
        <h3 slot="header">
          <ha-svg-icon .path=${mdiListBox}></ha-svg-icon>
          ${t("editor.common.label.features")}
        </h3>
        <div class="content">
          <bc-card-features-editor
            .hass=${this.hass}
            .stateObj=${this._stateObj}
            .config=${this._config}
            @value-changed=${this._handleFeaturesChanged}
          ></bc-card-features-editor>
        </div>
      </ha-expansion-panel>
    `;
  }

  private _handleFeaturesChanged(
    ev: CustomEvent<{ value: FeatureConfigWithMaybeInternals[] }>,
  ): void {
    ev.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    this.fireEvent("config-changed", {
      config: {
        ...this._config,
        features: ev.detail.value,
      },
    });
  }
}
