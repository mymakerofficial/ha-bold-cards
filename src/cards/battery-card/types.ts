import { BoldCardTypes } from "../../lib/cards/types";
import { LovelaceCardConfig } from "../../types/ha/lovelace";

export interface BatteryCardConfig extends LovelaceCardConfig {
  type: BoldCardTypes["BATTERY"];
}
