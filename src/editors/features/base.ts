import { LovelaceCardFeatureEditor } from "../../types/ha/lovelace";
import { BoldLovelaceEditor } from "../base";
import { LovelaceCardFeatureConfig } from "../../types/ha/feature";
import { property } from "lit/decorators";
import { HassEntity } from "home-assistant-js-websocket";

export abstract class BoldLovelaceCardFeatureEditor<
    TConfig extends LovelaceCardFeatureConfig,
    TStateObj extends HassEntity = HassEntity,
  >
  extends BoldLovelaceEditor<TConfig>
  implements LovelaceCardFeatureEditor
{
  // TODO this is actually never set, use context instead
  @property({ attribute: false }) public stateObj?: TStateObj;
}
