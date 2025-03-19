import { LovelaceCardConfigWithEntity } from "../../types/card";
import { BoldCardTypes } from "../../lib/cards/types";

export interface AirQualityCardConfig extends LovelaceCardConfigWithEntity {
  type: BoldCardTypes["AIR_QUALITY"];
}
