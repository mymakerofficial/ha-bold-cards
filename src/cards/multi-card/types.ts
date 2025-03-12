import { LovelaceCardConfig } from "../../types/ha/lovelace";
import { MediaPlayerTileConfig } from "../media-player-card/types";

type CardConfigs = MediaPlayerTileConfig;

export type MultiCardConfig = LovelaceCardConfig & {
  entities: string[];
  card: Omit<
    CardConfigs,
    "entity" | "view_layout" | "layout_options" | "grid_options" | "visibility"
  >;
};
