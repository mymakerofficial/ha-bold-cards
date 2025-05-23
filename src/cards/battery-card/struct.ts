import { z } from "zod/v4";
import { BoldCardType } from "../../lib/cards/types";
import { baseCardConfigStruct } from "../../helpers/ha/base-card-struct";

export const batteryCardConfigStruct = baseCardConfigStruct.extend({
  type: z.literal(BoldCardType.BATTERY),
});
