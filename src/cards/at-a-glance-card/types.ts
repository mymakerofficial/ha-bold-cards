import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { BoldCardTypes } from "../../lib/cards/types";
import { GlancePageConfig } from "../../lib/at-a-glance/types";

export interface BoldAtAGlanceCardConfig extends LovelaceCardConfig {
  type: BoldCardTypes["AT_A_GLANCE"];
  // TODO remove
  title_template?: string;
  // TODO remove
  content_template?: string;
  pages?: GlancePageConfig[];
}
