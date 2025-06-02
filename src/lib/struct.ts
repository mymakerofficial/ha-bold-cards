import z, { EnumLike, ZodEnum, ZodNativeEnum } from "zod";
import { isArray } from "./helpers";

export function enums<T extends string>(
  value: T[] | readonly T[],
): ZodEnum<[T, ...T[]]>;
export function enums<T extends EnumLike>(value: T): ZodNativeEnum<T>;
export function enums(value: unknown) {
  // eslint-disable-next-line no-restricted-syntax
  if (isArray(value)) return z.enum(value as [string, ...string[]]);
  // eslint-disable-next-line no-restricted-syntax
  return z.nativeEnum(value as EnumLike);
}
