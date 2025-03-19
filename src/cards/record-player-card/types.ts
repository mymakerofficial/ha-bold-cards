import { BoldCardTypes } from "../../lib/cards/types";
import { BoldMediaPlayerCardBaseConfig } from "../media-player-card/types";

export interface BoldRecordPlayerCardConfig
  extends BoldMediaPlayerCardBaseConfig {
  type: BoldCardTypes["RECORD_PLAYER"];
}
