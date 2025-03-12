import {
  LovelaceCardFeatureEditor,
  LovelaceCardFeatureEditorContext,
} from "../../types/ha/lovelace";
import { BoldLovelaceEditor } from "../base";
import { LovelaceCardFeatureConfig } from "../../types/ha/feature";
import { HassEntity } from "home-assistant-js-websocket";

export abstract class BoldLovelaceCardFeatureEditor<
    TConfig extends LovelaceCardFeatureConfig,
    TStateObj extends HassEntity = HassEntity,
  >
  extends BoldLovelaceEditor<TConfig, LovelaceCardFeatureEditorContext>
  implements LovelaceCardFeatureEditor<TConfig>
{
  protected get _stateObj() {
    if (!this.context?.entity_id) {
      return undefined;
    }
    const entityId = this.context.entity_id;
    return this.hass?.states[entityId] as TStateObj | undefined;
  }

  protected get _internals() {
    if (!this.context || typeof this.context !== "object") {
      return undefined;
    }
    return "internals" in this.context ? this.context.internals : undefined;
  }
}
