import { GetterOrMap, MaybeFunction, MaybePromise, Maybe, Pair } from "./types";

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
  return (
    typeof value === "object" &&
    !isArray(value) &&
    !isFunction(value) &&
    !isString(value) &&
    !isUndefined(value) &&
    !isNull(value)
  );
}

export function isEmpty<T extends string | object | any[] | undefined>(
  value: T,
): value is never {
  if (isUndefined(value)) {
    return true;
  }

  if (isString(value) || isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function isPromise<T>(value: unknown): value is Promise<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Promise<T>).then === "function"
  );
}

export function resolve<TRes, TArgs extends any[] = any[]>(
  maybeFn: MaybeFunction<TRes>,
  ...args: TArgs
): TRes {
  return isFunction(maybeFn) ? maybeFn(...args) : maybeFn;
}

export function toError<
  TError extends Error,
  TErrorVal = TError | string,
  TRes = TError extends string ? TError : TError,
>(maybeError: TErrorVal) {
  return (isString(maybeError) ? new Error(maybeError) : maybeError) as TRes;
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
  value: Maybe<string>,
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
>(value: Maybe<T>, getterOrMap?: GetterOrMap<T, R>, defaultValue?: D): R | D {
  if (isUndefined(value) || isUndefined(getterOrMap)) {
    return defaultValue as D;
  }
  if (isObject(getterOrMap)) {
    return (getterOrMap as any)[value] || defaultValue;
  }
  if (isFunction(getterOrMap)) {
    return getterOrMap(value);
  }
  return getterOrMap;
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

export function doIfDefined<T, R, E = R>(
  fn: (value: T) => R,
  value: Maybe<T>,
  elseValue: E,
): R | E {
  if (isDefined(value)) {
    return fn(value);
  }
  return elseValue;
}

// takes a maybe promise and returns a promise
export function toPromise<T>(value: MaybePromise<T>): Promise<T> {
  return isPromise(value) ? value : Promise.resolve(value);
}

export function maxOrUndefined(arr: number[]): Maybe<number> {
  if (isEmpty(arr)) {
    return undefined;
  }
  return Math.max(...arr);
}

export function minOrUndefined(arr: number[]): Maybe<number> {
  if (isEmpty(arr)) {
    return undefined;
  }
  return Math.min(...arr);
}

export function splice<T>(
  arr: Maybe<T[]>,
  start: number,
  deleteCount: number = 1,
  ...items: T[]
): T[] {
  if (!arr) {
    return [];
  }
  const newArr = [...arr];
  newArr.splice(start, deleteCount, ...items);
  return newArr;
}

export function patchElement<T>(
  arr: Maybe<T[]>,
  index: number,
  patch: Partial<T>,
) {
  if (!arr) {
    return [];
  }
  const newArr = [...arr];
  newArr[index] = { ...newArr[index], ...patch };
  return newArr;
}

export function move<T>(arr: Maybe<T[]>, from: number, to: number): T[] {
  if (!arr) {
    return [];
  }
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}
