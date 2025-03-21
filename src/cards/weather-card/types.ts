import { LovelaceCardConfigWithEntity } from "../../types/card";
import { BoldCardTypes } from "../../lib/cards/types";

export interface WeatherCardConfig extends LovelaceCardConfigWithEntity {
  type: BoldCardTypes["WEATHER"];
  temperature_entity?: string;
}
