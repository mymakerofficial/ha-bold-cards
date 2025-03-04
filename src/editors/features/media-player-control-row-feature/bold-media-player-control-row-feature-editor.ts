import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { BoldMediaPlayerControlRowFeatureConfig } from "../../../features/media-player-control-row-feature/types";
import { any } from "superstruct";
import { html } from "lit";

@customElement("bold-media-player-control-row-feature-editor")
export class BoldMediaPlayerControlRowFeatureEditor extends BoldLovelaceCardFeatureEditor<BoldMediaPlayerControlRowFeatureConfig> {
  protected get _struct() {
    return any();
  }

  protected render() {
    return html`<div>Editor</div>`;
  }
}
