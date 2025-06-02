import { property } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { HassObjectMixin } from "../lib/hass-object";
import { BoldElement } from "./bold-element";

export class BoldHassElement extends HassObjectMixin(BoldElement) {
  @property({ attribute: false }) public hass?: HomeAssistant;
}
