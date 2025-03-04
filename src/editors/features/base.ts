import {
  LovelaceCardConfig,
  LovelaceCardEditor,
  LovelaceCardFeatureEditor,
} from "../../types/ha/lovelace";
import { BoldLovelaceEditor } from "../base";
import { LovelaceCardFeatureConfig } from "../../types/ha/feature";

export abstract class BoldLovelaceCardFeatureEditor<
    TConfig extends LovelaceCardFeatureConfig,
  >
  extends BoldLovelaceEditor<TConfig>
  implements LovelaceCardFeatureEditor {}
