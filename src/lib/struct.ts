import { assert, define, Struct } from "superstruct";
import { StructError } from "superstruct/dist/error";

export function exactMatch<T extends string>(expected: T): Struct<T, null> {
  return define(
    "type",
    (value) =>
      value === expected ||
      `Expected to be "${expected}", but received "${value}"`,
  );
}

interface TypedUnionOptions<
  TField extends string,
  TMap extends {
    [key in string]: object;
  },
  TAssignObject = object,
  TDefault = undefined,
> {
  name?: string;
  key: TField;
  assign?: Struct<TAssignObject, unknown>;
  structs: { [key in keyof TMap]: Struct<TMap[key], unknown> };
  default?: Struct<TDefault, unknown>;
}

export function typedUnion<
  TField extends string,
  TMap extends {
    [key in string]: object;
  },
  TDefault = undefined,
>(options: TypedUnionOptions<TField, TMap, TDefault>) {
  return define<
    TDefault extends undefined ? TMap[keyof TMap] : TMap[keyof TMap] | TDefault
  >(options.name ?? "typedUnion", (value) => {
    if (!value || typeof value !== "object" || !(options.key in value)) {
      return `Expected an object containing at least a "${String(options.key)}" key, but received "${value}"`;
    }

    value = value as TMap[keyof TMap];

    // @ts-expect-error *shrug*
    const key = value[options.key];
    const struct = options.structs[key as keyof TMap];

    if (!struct) {
      if (options.default) {
        try {
          assert(value, options.default);
        } catch (e) {
          return (e as StructError).message;
        }
        return true;
      }

      return `Expected "${String(options.key)}" to be one of \`${Object.keys(
        options.structs,
      )
        .map((it) => '"' + it + '"')
        .join(", ")}\`, but received "${key}"`;
    }

    try {
      assert(value, struct);
    } catch (e) {
      return (e as StructError).message;
    }
    return true;
  });
}
