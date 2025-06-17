import {
  BaseHassObject,
  BasicHassObjectMixin,
  HassObjectConstructor,
} from "./basic-hass-object";

export function HassObjectMixin<TBase extends HassObjectConstructor>(
  Base: TBase,
) {
  return class extends BasicHassObjectMixin(Base) {};
}

export class HassObject extends HassObjectMixin(BaseHassObject) {}
