import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";

export interface BoldAtAGlanceCardConfig extends LovelaceCardConfig {
  type: BoldCardTypes["AT_A_GLANCE"];
  title_template?: string;
  content_template?: string;
}
