import { LovelaceCardConfigWithEntity } from "../../types/card";
import { BoldCardTypes } from "../../lib/cards/types";

export const MiniWeatherCardShape = {
  NONE: "none",
  RECTANGLE: "rectangle",
  PILL: "pill",
  SCALLOP: "scallop",
} as const;
export type MiniWeatherCardShape =
  (typeof MiniWeatherCardShape)[keyof typeof MiniWeatherCardShape];

export const MiniWeatherCardArrangement = {
  HORIZONTAL: "horizontal",
  TILTED: "tilted",
} as const;
export type MiniWeatherCardArrangement =
  (typeof MiniWeatherCardArrangement)[keyof typeof MiniWeatherCardArrangement];

export interface MiniWeatherCardConfig extends LovelaceCardConfigWithEntity {
  type: BoldCardTypes["MINI_WEATHER"];
  temperature_entity?: string;
  shape?: MiniWeatherCardShape;
  arrangement?: MiniWeatherCardArrangement;
}
