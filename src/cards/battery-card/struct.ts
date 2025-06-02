import z from "zod";
import { BoldCardType } from "../../lib/cards/types";
import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";

export const batteryCardConfigStruct = baseCardConfigStruct.extend({
  type: z.literal(BoldCardType.BATTERY),
});
