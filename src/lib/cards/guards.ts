import { LovelaceCardConfigWithEntity } from "../../types/card";
import { LovelaceCardConfig } from "../../types/ha/lovelace";

export function isLovelaceCardConfigWithEntity(
  config: LovelaceCardConfig,
): config is LovelaceCardConfigWithEntity {
  return typeof config.entity === "string";
}
