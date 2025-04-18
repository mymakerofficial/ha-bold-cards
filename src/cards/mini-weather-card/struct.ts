import { assign, object, optional, string, enums } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";
import { MiniWeatherCardArrangement, MiniWeatherCardShape } from "./types";

export const miniWeatherCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    temperature_entity: optional(string()),
    shape: optional(enums(Object.values(MiniWeatherCardShape))),
    arrangement: optional(enums(Object.values(MiniWeatherCardArrangement))),
    temperature: optional(string()),
    temperature_template: optional(string()),
    icon: optional(string()),
    icon_template: optional(string()),
  }),
);
