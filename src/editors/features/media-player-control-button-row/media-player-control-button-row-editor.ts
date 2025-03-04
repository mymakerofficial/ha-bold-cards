import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { MediaPlayerControlButtonRowFeatureConfig } from "../../../features/media-player-control-button-row/types";
import { any } from "superstruct";
import { html } from "lit";

@customElement("media-player-control-button-row-editor")
export class BoldMediaPlayerControlButtonRowEditor extends BoldLovelaceCardFeatureEditor<MediaPlayerControlButtonRowFeatureConfig> {
  protected get _struct() {
    return any();
  }

  protected render() {
    return html`<div>Editor</div>`;
  }
}
