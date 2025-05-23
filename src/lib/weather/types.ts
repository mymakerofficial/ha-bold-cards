import {
  HassEntityAttributeBase,
  HassEntityBase,
} from "home-assistant-js-websocket";
import { EntityState } from "../../types/ha/entity";

interface ForecastAttribute {
  temperature: number;
  datetime: string;
  templow?: number;
  precipitation?: number;
  precipitation_probability?: number;
  humidity?: number;
  condition?: string;
  is_daytime?: boolean;
  pressure?: number;
  wind_speed?: string;
}

export interface WeatherEntityAttributes extends HassEntityAttributeBase {
  attribution?: string;
  humidity?: number;
  forecast?: ForecastAttribute[];
  is_daytime?: boolean;
  pressure?: number;
  temperature?: number;
  visibility?: number;
  wind_bearing?: number | string;
  wind_speed?: number;
  precipitation_unit: string;
  pressure_unit: string;
  temperature_unit: string;
  visibility_unit: string;
  wind_speed_unit: string;
}

export const WeatherState = {
  ...EntityState,
  CLEAR_NIGHT: "clear-night",
  CLOUDY: "cloudy",
  FOG: "fog",
  HAIL: "hail",
  LIGHTNING: "lightning",
  LIGHTNING_RAINY: "lightning-rainy",
  PARTLYCLOUDY: "partlycloudy",
  POURING: "pouring",
  RAINY: "rainy",
  SNOWY: "snowy",
  SNOWY_RAINY: "snowy-rainy",
  SUNNY: "sunny",
  WINDY: "windy",
  WINDY_VARIANT: "windy-variant",
  EXCEPTIONAL: "exceptional",
} as const;
export type WeatherState = (typeof WeatherState)[keyof typeof WeatherState];

export interface WeatherEntity extends HassEntityBase {
  attributes: WeatherEntityAttributes;
  state: WeatherState;
}
