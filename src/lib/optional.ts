import { isDefined, isUndefined, resolve, toError } from "./helpers";
import { MaybeFunction } from "./types";

export class Optional<TValue> {
  readonly #value: TValue | undefined;

  constructor(value: TValue | undefined) {
    this.#value = value;
  }

  static of<TValue>(value: TValue | undefined): Optional<TValue> {
    return new Optional(value);
  }

  static empty<TValue>(): Optional<TValue> {
    return new Optional<TValue>(undefined);
  }

  get value(): TValue {
    this.throwIfAbsent();
    return this.#value!;
  }

  get(): TValue {
    this.throwIfAbsent();
    return this.#value!;
  }

  getOrElse<TElse>(defaultValue: MaybeFunction<TElse>): TValue | TElse {
    if (this.isAbsent()) {
      return resolve(defaultValue);
    }
    return this.#value!;
  }

  getOrNull(): TValue | null {
    if (this.isAbsent()) {
      return null;
    }
    return this.#value!;
  }

  getOrUndefined(): TValue | undefined {
    if (this.isAbsent()) {
      return undefined;
    }
    return this.#value!;
  }

  throwIfAbsent<TError extends Error>(
    error: MaybeFunction<
      TError | string
    > = "Tried to get value but value was absent.",
  ): void {
    if (this.isAbsent()) {
      throw toError(resolve(error));
    }
  }

  getOrThrow<TError extends Error>(
    error?: MaybeFunction<TError | string>,
  ): TValue {
    this.throwIfAbsent(error);
    return this.#value!;
  }

  isPresent(): boolean {
    return isDefined(this.#value);
  }

  isAbsent(): boolean {
    return isUndefined(this.#value);
  }
}
