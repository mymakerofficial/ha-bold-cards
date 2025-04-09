import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";
import { resolveGetterOrMap } from "../lib/helpers";
import { GetterOrMap } from "../lib/types";

type ValidValue = string | number | symbol;

interface ToOptionsProps<T extends ValidValue> {
  label?: GetterOrMap<T, string>;
  labelScope?: string;
  description?: GetterOrMap<T, string>;
  descriptionScope?: string;
  image?: GetterOrMap<T, string | SelectBoxOptionImage>;
  icon?: GetterOrMap<T, string>;
  disabled?: GetterOrMap<T, boolean>;
  hideLabel?: GetterOrMap<T, boolean>;
}

export function enumToOptions<T extends ValidValue>(
  obj: { [key in T]: string },
  props?: ToOptionsProps<T>,
): SelectOption[] {
  return arrayToOptions<T>(Object.values(obj), props);
}

export function arrayToOptions<T extends ValidValue>(
  arr: T[],
  props?: ToOptionsProps<T>,
): SelectOption[] {
  return arr.map((item) => valueToOption(item, props)) as SelectOption[];
}

export function valueToOption<T extends ValidValue>(
  value: T,
  props?: ToOptionsProps<T>,
): SelectOption {
  const valueString = String(value);
  return {
    value,
    label: resolveGetterOrMap(
      value,
      props?.label,
      props?.labelScope
        ? t(valueString, { scope: props?.labelScope })
        : valueString,
    ),
    description: resolveGetterOrMap(
      value,
      props?.description,
      props?.descriptionScope
        ? t(valueString, { scope: props?.descriptionScope, defaultValue: "" })
        : undefined,
    ),
    image: resolveGetterOrMap(value, props?.image),
    icon: resolveGetterOrMap(value, props?.icon),
    disabled: resolveGetterOrMap(value, props?.disabled, false),
    hideLabel: resolveGetterOrMap(value, props?.hideLabel, false),
  } as SelectOption;
}

export function stopPropagation(ev: Event) {
  ev.stopPropagation();
}
