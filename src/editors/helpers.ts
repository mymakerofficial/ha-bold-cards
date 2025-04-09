import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";
import { resolveGetterOrMap } from "../lib/helpers";
import { GetterOrMap } from "../lib/types";

interface ToOptionsProps<T extends string | number | symbol> {
  labelScope?: string;
  descriptionScope?: string;
  image?: GetterOrMap<T, string | SelectBoxOptionImage>;
  icon?: GetterOrMap<T, string>;
  disabled?: GetterOrMap<T, boolean>;
  hideLabel?: GetterOrMap<T, boolean>;
}

export function enumToOptions<T extends string | number | symbol>(
  obj: { [key in T]: string },
  props?: ToOptionsProps<T>,
): SelectOption[] {
  return arrayToOptions<T>(Object.values(obj), props);
}

export function arrayToOptions<T extends string | number | symbol>(
  arr: T[],
  props?: ToOptionsProps<T>,
): SelectOption[] {
  return arr.map((item) => valueToOption(item, props)) as SelectOption[];
}

export function valueToOption<T extends string | number | symbol>(
  value: T,
  props?: ToOptionsProps<T>,
): SelectOption {
  return {
    value,
    label: props?.labelScope
      ? t(String(value), { scope: props?.labelScope })
      : value,
    description: props?.descriptionScope
      ? t(String(value), { scope: props?.descriptionScope, defaultValue: "" })
      : undefined,
    image: resolveGetterOrMap(value, props?.image),
    icon: resolveGetterOrMap(value, props?.icon),
    disabled: resolveGetterOrMap(value, props?.disabled, false),
    hideLabel: resolveGetterOrMap(value, props?.hideLabel, false),
  } as SelectOption;
}

export function stopPropagation(ev: Event) {
  ev.stopPropagation();
}
