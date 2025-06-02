import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";
import { MiniWeatherCardArrangement, MiniWeatherCardShape } from "./types";
import z from "zod";
import { BoldCardType } from "../../lib/cards/types";
import { enums } from "../../lib/struct";

export const miniWeatherCardConfigStruct = baseCardConfigStruct.extend({
  type: z.literal(BoldCardType.MINI_WEATHER),
  entity: z.string().optional(),
  temperature_entity: z.string().optional(),
  shape: enums(MiniWeatherCardShape).optional(),
  arrangement: enums(MiniWeatherCardArrangement).optional(),
  temperature: z.string().optional(),
  temperature_template: z.string().optional(),
  icon: z.string().optional(),
  icon_template: z.string().optional(),
});
