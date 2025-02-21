import {
  any,
  array,
  assign,
  boolean,
  enums,
  object,
  optional,
  string,
  union,
} from "superstruct";
import { baseLovelaceCardConfig } from "../../helpers/base-card-struct";

export const cardConfigStruct = assign(
  baseLovelaceCardConfig,
  object({
    entity: optional(string()),
    name: optional(string()),
    icon: optional(string()),
    hide_state: optional(boolean()),
    state_content: optional(union([string(), array(string())])),
    color: optional(string()),
    show_entity_picture: optional(boolean()),
    vertical: optional(boolean()),
    // TODO: should use actionConfigStruct
    tap_action: optional(any()),
    hold_action: optional(any()),
    double_tap_action: optional(any()),
    icon_tap_action: optional(any()),
    icon_hold_action: optional(any()),
    icon_double_tap_action: optional(any()),
    features: optional(array(any())),
    features_position: optional(enums(["bottom", "inline"])),
  }),
);
