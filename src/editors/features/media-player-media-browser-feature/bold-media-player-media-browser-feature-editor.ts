import { customElement } from "lit/decorators";
import { BoldLovelaceCardFeatureEditor } from "../base";
import { html } from "lit";
import { editorBaseStyles } from "../../styles";
import { t } from "../../../localization/i18n";
import { mediaPlayerMediaBrowserFeatureStruct } from "../../../features/media-player-media-browser-feature/struct";
import { BoldMediaPlayerMediaBrowserFeatureConfig } from "../../../features/media-player-media-browser-feature/types";

@customElement("bold-media-player-media-browser-feature-editor")
export class BoldMediaPlayerMediaBrowserFeatureEditor extends BoldLovelaceCardFeatureEditor<BoldMediaPlayerMediaBrowserFeatureConfig> {
  protected get _struct() {
    return mediaPlayerMediaBrowserFeatureStruct;
  }

  protected render() {
    return this.renderWith(() => {
      return html`
        <bc-form-help-box
          .header=${t(
            "editor.feature.media_player_media_browser.no_editor.header",
          )}
          .content=${t(
            "editor.feature.media_player_media_browser.no_editor.content",
          )}
          .icon=${"mdi:information-outline"}
        ></bc-form-help-box>
      `;
    });
  }

  static styles = [editorBaseStyles];
}
