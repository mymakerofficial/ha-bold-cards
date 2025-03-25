import {
  getGlanceItemRenderer,
  getGlanceItemsRenderer,
  getGlancePageRenderer,
  getGlancePagesRenderer,
} from "./at-a-glance/helpers";
import {
  BaseHassObject,
  BasicHassObjectMixin,
  HassObjectConstructor,
} from "./basic-hass-object";

export function HassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends BasicHassObjectMixin(Base) {
    protected getGlancePageRenderer(partial: boolean = false) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlancePageRenderer(this.hass, partial);
    }

    protected getGlancePagesRenderer(partial: boolean = false) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlancePagesRenderer(this.hass, partial);
    }

    protected getGlanceItemRenderer(partial: boolean = false) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlanceItemRenderer(this.hass, partial);
    }

    protected getGlanceItemsRenderer(partial: boolean = false) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlanceItemsRenderer(this.hass, partial);
    }
  };
}

export class HassObject extends HassObjectMixin(BaseHassObject) {}
