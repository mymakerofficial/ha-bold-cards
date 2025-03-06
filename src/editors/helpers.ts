import { t } from "../localization/i18n";
import { SelectBoxOptionImage, SelectOption } from "../types/ha/selector";

interface ToOptionsOptions<T extends { [key: string]: string }> {
  labelScope?: string;
  descriptionScope?: string;
  image?:
    | Partial<{ [key in T[keyof T]]: string | SelectBoxOptionImage }>
    | ((value: T[keyof T]) => string | SelectBoxOptionImage);
  disabled?:
    | Partial<{ [key in T[keyof T]]: boolean }>
    | ((value: T[keyof T]) => boolean);
}

export function enumToOptions<T extends { [key: string]: string }>(
  obj: T,
  options?: ToOptionsOptions<T>,
): SelectOption[] {
  return arrayToOptions(Object.values(obj), options as any);
}

export function arrayToOptions(
  arr: string[],
  options?: ToOptionsOptions<{ [key: string]: string }>,
): SelectOption[] {
  return (arr as string[]).map((item) => ({
    value: item,
    label: options?.labelScope ? t(item, { scope: options?.labelScope }) : item,
    description: options?.descriptionScope
      ? t(item, { scope: options?.descriptionScope, defaultValue: "" })
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
