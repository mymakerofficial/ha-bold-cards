import { define, Struct } from "superstruct";

export function exactMatch<T extends string>(expected: T): Struct<T, null> {
  return define(
    "type",
    (value) =>
      value === expected ||
      `Expected to be "${expected}", but received "${value}"`,
  );
}
