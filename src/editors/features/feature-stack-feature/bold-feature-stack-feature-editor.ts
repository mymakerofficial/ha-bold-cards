import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { css, html } from "lit";
import { fireEvent } from "custom-card-helpers";
import { editorBaseStyles } from "../../styles";
import { BoldFeatureStackFeatureConfig } from "../../../features/feature-stack-feature/types";
import { FeatureConfigWithMaybeInternals } from "../../../lib/internals/types";
import { featureStackFeatureStruct } from "../../../features/feature-stack-feature/struct";

@customElement("bold-feature-stack-feature-editor")
export class BoldFeatureStackFeatureEditor extends BoldLovelaceCardFeatureEditor<BoldFeatureStackFeatureConfig> {
  protected constructor() {
    super();
    import("../../cards/features/bc-card-feature-editor");
  }

  protected get _struct() {
    return featureStackFeatureStruct;
  }

  protected render() {
    return html`
      <div class="container">
        <bc-card-features-editor
          .hass=${this.hass}
          .stateObj=${this._stateObj}
          .config=${this._config}
          @value-changed=${this._handleFeaturesChanged}
        ></bc-card-features-editor>
      </div>
    `;
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

  static styles = [
    editorBaseStyles,
    css`
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    `,
  ];
}
