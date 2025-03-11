import {
  LovelaceCardConfig,
  LovelaceCardEditor,
} from "../../types/ha/lovelace";
import { BoldLovelaceEditor } from "../base";
import { html, nothing } from "lit";
import { t } from "../../localization/i18n";
import { mdiListBox } from "@mdi/js";
import {
  LovelaceCardConfigWithEntity,
  LovelaceCardConfigWithFeatures,
} from "../../types/card";
import { HassEntityBase } from "home-assistant-js-websocket/dist/types";
import { FeatureConfigWithMaybeInternals } from "../../types/ha/feature";
import { fireEvent } from "custom-card-helpers";

export abstract class BoldLovelaceCardEditor<TConfig extends LovelaceCardConfig>
  extends BoldLovelaceEditor<TConfig>
  implements LovelaceCardEditor {}

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
    import("./features/bc-card-control-features-editor");
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

  protected _controlsEditorTemplate() {
    if (
      !this._config ||
      !this._config.features ||
      !this._config.features.some(
        (feature) => feature.type === "custom:bold-media-player-control-row",
      )
    ) {
      return nothing;
    }

    return html`<bc-card-control-features-editor
      .hass=${this.hass}
      .stateObj=${this._stateObj}
      .config=${this._config}
      @value-changed=${this._handleFeaturesChanged}
    ></bc-card-control-features-editor>`;
  }

  private _handleFeaturesChanged(
    ev: CustomEvent<{ value: FeatureConfigWithMaybeInternals[] }>,
  ): void {
    ev.stopPropagation();

    if (!this._config || !this.hass) {
      return;
    }

    fireEvent(this, "config-changed", {
      config: {
        ...this._config,
        features: ev.detail.value,
      },
    });
  }
}
