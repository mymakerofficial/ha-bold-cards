import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";
import { MiniWeatherCardArrangement, MiniWeatherCardShape } from "./types";
import { z } from "zod/v4";
import { BoldCardType } from "../../lib/cards/types";

export const miniWeatherCardConfigStruct = baseCardConfigStruct.extend({
  type: z.literal(BoldCardType.MINI_WEATHER),
  entity: z.string().optional(),
  temperature_entity: z.string().optional(),
  shape: z.enum(MiniWeatherCardShape).optional(),
  arrangement: z.enum(MiniWeatherCardArrangement).optional(),
  temperature: z.string().optional(),
  temperature_template: z.string().optional(),
  icon: z.string().optional(),
  icon_template: z.string().optional(),
});
