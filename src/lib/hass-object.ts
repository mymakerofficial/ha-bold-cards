import { HomeAssistant } from "../types/ha/lovelace";

import { getGlancePagesRenderer } from "./at-a-glance/helpers";
import {
  BaseHassObject,
  BasicHassObjectMixin,
  HassObjectConstructor,
} from "./basic-hass-object";

export function HassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends BasicHassObjectMixin(Base) {
    protected getGlancePagesRenderer() {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlancePagesRenderer(this.hass);
    }
  };
}

export class HassObject extends HassObjectMixin(BaseHassObject) {}
