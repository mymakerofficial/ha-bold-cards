import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";
import { resolveGetterOrMap } from "../lib/helpers";
import { GetterOrMap } from "../lib/types";

interface ToOptionsOptions<T extends string | number | symbol> {
  labelScope?: string;
  descriptionScope?: string;
  image?: GetterOrMap<T, string | SelectBoxOptionImage>;
  disabled?: GetterOrMap<T, boolean>;
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
  return arr.map((item) => ({
    value: item,
    label: options?.labelScope
      ? t(String(item), { scope: options?.labelScope })
      : item,
    description: options?.descriptionScope
      ? t(String(item), { scope: options?.descriptionScope, defaultValue: "" })
      : undefined,
    image: resolveGetterOrMap(item, options?.image),
    disabled: resolveGetterOrMap(item, options?.disabled, false),
  })) as SelectOption[];
}

export function stopPropagation(ev: Event) {
  ev.stopImmediatePropagation();
  ev.stopPropagation();
  ev.preventDefault();
}
