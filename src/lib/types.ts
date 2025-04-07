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

export type Optional<T> = T | undefined;

export type Nullable<T> = T | null;

export type Pair<T, G> = [T, G];

export type MaybeFunction<T> = T | (() => T);

export type GetterOrMap<T extends string | number | symbol, R> =
  | ((value: T) => R)
  | Partial<{ [key in T]: R }>
  | R;
