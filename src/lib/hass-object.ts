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
import { GlanceItemType, GlancePageType } from "./at-a-glance/types";

export function HassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends BasicHassObjectMixin(Base) {
    protected getGlancePageRenderer(
      type: GlancePageType,
      partial: boolean = false,
    ) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlancePageRenderer(this.hass, type, partial);
    }

    protected getGlancePagesRenderer(partial: boolean = false) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlancePagesRenderer(this.hass, partial);
    }

    protected getGlanceItemRenderer(
      type: GlanceItemType,
      partial: boolean = false,
    ) {
      if (!this.hass) {
        throw new Error("hass is not set");
      }
      return getGlanceItemRenderer(this.hass, type, partial);
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
