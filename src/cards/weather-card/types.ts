import { LovelaceCardConfigWithEntity } from "../../types/card";
import { BoldCardTypes } from "../../lib/cards/types";

export const WeatherCardShape = {
  RECTANGLE: "rectangle",
  PILL: "pill",
  SCALLOP: "scallop",
} as const;
export type WeatherCardShape =
  (typeof WeatherCardShape)[keyof typeof WeatherCardShape];

export interface WeatherCardConfig extends LovelaceCardConfigWithEntity {
  type: BoldCardTypes["WEATHER"];
  temperature_entity?: string;
  shape?: WeatherCardShape;
}
