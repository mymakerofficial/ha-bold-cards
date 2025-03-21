import { assign, object, optional, string } from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/ha/base-card-struct";

export const weatherCardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    temperature_entity: optional(string()),
  }),
);
