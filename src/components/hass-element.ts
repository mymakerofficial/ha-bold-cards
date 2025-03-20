import { property } from "lit/decorators";
import { HomeAssistant } from "../types/ha/lovelace";
import { LitElement } from "lit";
import { HassObjectMixin } from "../lib/hass-object";

export class BoldHassElement extends HassObjectMixin(LitElement) {
  @property({ attribute: false }) public hass?: HomeAssistant;
}
