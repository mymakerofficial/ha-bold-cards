import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";
import { resolveGetterOrMap } from "../lib/helpers";
import { GetterOrMap } from "../lib/types";

interface ToOptionsOptions<T extends string | number | symbol> {
  labelScope?: string;
  descriptionScope?: string;
  image?: GetterOrMap<T, string | SelectBoxOptionImage>;
  icon?: GetterOrMap<T, string>;
  disabled?: GetterOrMap<T, boolean>;
  hideLabel?: GetterOrMap<T, boolean>;
}

export function enumToOptions<T extends string | number | symbol>(
  obj: { [key in T]: string },
  options?: ToOptionsOptions<T>,
): SelectOption[] {
  return arrayToOptions<T>(Object.values(obj), options);
}

export function arrayToOptions<T extends string | number | symbol>(
  arr: T[],
  options?: ToOptionsOptions<T>,
): SelectOption[] {
  return arr.map((item) => valueToOption(item, options)) as SelectOption[];
}

export function valueToOption<T extends string | number | symbol>(
  value: T,
  options?: ToOptionsOptions<T>,
): SelectOption {
  return {
    value,
    label: options?.labelScope
      ? t(String(value), { scope: options?.labelScope })
      : value,
    description: options?.descriptionScope
      ? t(String(value), { scope: options?.descriptionScope, defaultValue: "" })
      : undefined,
    image: resolveGetterOrMap(value, options?.image),
    icon: resolveGetterOrMap(value, options?.icon),
    disabled: resolveGetterOrMap(value, options?.disabled, false),
    hideLabel: resolveGetterOrMap(value, options?.hideLabel, false),
  } as SelectOption;
}

export function stopPropagation(ev: Event) {
  ev.stopPropagation();
}
