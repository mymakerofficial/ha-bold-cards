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
