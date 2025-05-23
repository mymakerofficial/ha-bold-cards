import { TemplateResult } from "lit-element";
import { nothing } from "lit";

export const DefaultConfigType = {
  DEFAULT: "default",
  INLINED: "inlined",
  EXTERNAL: "external",
} as const;
export type DefaultConfigType =
  (typeof DefaultConfigType)[keyof typeof DefaultConfigType];

export type DefaultConfigMap<T> = {
  [K in DefaultConfigType]: T;
};

export type Maybe<T> = T | undefined;

export type Nullable<T> = T | null;

export type Pair<T, G> = [T, G];

export type MaybeFunction<TRes, TArgs extends any[] = any[]> =
  | TRes
  | ((...args: TArgs) => TRes);

export type MaybePromise<T> = T | Promise<T>;

export type GetterOrMap<T extends string | number | symbol, R> =
  | ((value: T) => R)
  | Partial<{ [key in T]: R }>
  | R;

export type Constructor<T = any> = new (...args: any[]) => T;

export type RenderResult = TemplateResult | typeof nothing;

export type Replace<
  T extends string,
  S extends string,
  D extends string,
  A extends string = "",
> = T extends `${infer L}${S}${infer R}`
  ? Replace<R, S, D, `${A}${L}${D}`>
  : `${A}${T}`;

export type KebabToSnake<T extends string> = Replace<T, "-", "_">;
export type SnakeToKebab<T extends string> = Replace<T, "_", "-">;
