import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";

interface ToOptionsOptions<T extends string | number | symbol> {
  labelScope?: string;
  descriptionScope?: string;
  image?:
    | Partial<{ [key in T]: string | SelectBoxOptionImage }>
    | ((value: T) => string | SelectBoxOptionImage);
  disabled?: Partial<{ [key in T]: boolean }> | ((value: T) => boolean);
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
    image: !!options?.image
      ? typeof options?.image === "function"
        ? options.image(item)
        : options?.image?.[item]
      : undefined,
    disabled: !!options?.disabled
      ? typeof options?.disabled === "function"
        ? options.disabled(item)
        : options?.disabled?.[item]
      : false,
  })) as SelectOption[];
}

export function stopPropagation(ev: Event) {
  ev.stopImmediatePropagation();
  ev.stopPropagation();
  ev.preventDefault();
}
