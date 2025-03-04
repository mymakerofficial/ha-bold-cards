import { t, TranslateOptions } from "../localization/i18n";
import { SelectOption } from "../types/ha/selector";

export function enumToOptions(
  obj: Record<string, string>,
  options?: TranslateOptions,
): SelectOption[] {
  return arrayToOptions(Object.values(obj), options);
}

export function arrayToOptions(
  arr: string[],
  options?: TranslateOptions,
): SelectOption[] {
  return (arr as string[]).map((item) => ({
    value: item,
    label: options ? t(item, options) : item,
  })) as SelectOption[];
}

export function stopPropagation(ev: Event) {
  ev.stopImmediatePropagation();
  ev.stopPropagation();
  ev.preventDefault();
}
