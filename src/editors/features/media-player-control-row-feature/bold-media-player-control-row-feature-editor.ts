import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { BoldMediaPlayerControlRowFeatureConfig } from "../../../features/media-player-control-row-feature/types";
import { html } from "lit";
import { mediaPlayerControlRowFeatureStruct } from "../../../features/media-player-control-row-feature/struct";
import { fireEvent } from "custom-card-helpers";

@customElement("bold-media-player-control-row-feature-editor")
export class BoldMediaPlayerControlRowFeatureEditor extends BoldLovelaceCardFeatureEditor<BoldMediaPlayerControlRowFeatureConfig> {
  protected get _struct() {
    return mediaPlayerControlRowFeatureStruct;
  }

  protected render() {
    return html`
      <bc-controls-editor
        .controls=${this._config?.controls ?? []}
        .stateObj=${this.stateObj}
        @value-changed=${this._handleControlsChanged}
      ></bc-controls-editor>
    `;
  }

  protected _handleControlsChanged(ev: CustomEvent) {
    fireEvent(this, "config-changed", {
      config: { ...this._config, controls: ev.detail.value },
    });
  }
}
