import { assign, object, optional, string, enums } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { WeatherCardShape } from "./types";

export const weatherCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    temperature_entity: optional(string()),
    shape: optional(enums(Object.values(WeatherCardShape))),
  }),
);
