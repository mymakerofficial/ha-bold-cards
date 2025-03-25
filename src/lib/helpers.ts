import { GetterOrMap, MaybeFunction, Optional, Pair } from "./types";

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function firstOf<T>(list: T[] | undefined): T | undefined {
  if (!list) {
    return undefined;
  }
  return list[0];
}

export function lastOf<T>(list: T[] | undefined): T | undefined {
  if (!list) {
    return undefined;
  }
  return list[list.length - 1];
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isEmpty<T extends string | object | any[]>(
  value: T,
): value is never {
  if (isString(value) || isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function resolve<T>(maybeFn: MaybeFunction<T>): T {
  return isFunction(maybeFn) ? maybeFn() : maybeFn;
}

export function pair<T, G>(a: T, b: G): Pair<T, G> {
  return [a, b];
}

export function match<T>(
  options: Pair<MaybeFunction<boolean>, T>[],
  defaultValue: T,
): T {
  const match = options.find(([condition]) => resolve(condition));
  return match ? match[1] : defaultValue;
}

export function matchRegex<T>(
  value: Optional<string>,
  options: Pair<RegExp, T>[],
  defaultValue: T,
): T {
  if (!value) {
    return defaultValue;
  }
  const match = options.find(([regex]) => regex.test(value));
  return match ? match[1] : defaultValue;
}

export function resolveGetterOrMap<
  T extends string | number | symbol,
  R,
  D extends R | undefined,
>(
  value: Optional<T>,
  getterOrMap?: GetterOrMap<T, R>,
  defaultValue?: D,
): R | D {
  if (isUndefined(value) || isUndefined(getterOrMap)) {
    return defaultValue as D;
  }
  return (
    isFunction(getterOrMap) ? getterOrMap(value) : getterOrMap[value]
  ) as R;
}

export function parseYamlBoolean(value?: string): boolean {
  return (
    value === "true" ||
    value === "True" ||
    value === "TRUE" ||
    value === "on" ||
    value === "On" ||
    value === "ON"
  );
}
