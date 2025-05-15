import { isDefined, resolve, toError } from "./helpers";
import { MaybeFunction } from "./types";

export class Result<TValue, TError = Error> {
  readonly #value?: TValue;
  readonly #error?: TError;

  constructor(value?: TValue, error?: TError) {
    this.#value = value;
    this.#error = error;
  }

  static void(): Result<void> {
    return new Result<void>(void 0);
  }

  static from<TValue>(value: TValue): Result<TValue> {
    return new Result<TValue>(value);
  }

  static fromError<
    TValue = void,
    TError extends Error | string = Error,
    TResError = TError extends string ? Error : TError,
  >(error: TError) {
    return new Result<TValue, TResError>(undefined, toError(error));
  }

  static run<TValue>(fn: () => TValue): Result<TValue> {
    try {
      return Result.from<TValue>(fn());
    } catch (error) {
      return Result.fromError<TValue>(error as Error);
    }
  }

  static runAsync<TValue>(fn: () => Promise<TValue>) {
    return new Promise<Result<TValue>>((resolve) => {
      fn()
        .then((value) => resolve(Result.from(value)))
        .catch((error) => resolve(Result.fromError(error)));
    });
  }

  static wrap<TValue>(fn: () => Result<TValue>): Result<TValue> {
    try {
      return fn();
    } catch (error) {
      return Result.fromError<TValue>(error as Error);
    }
  }

  static wrapAsync<TValue>(fn: () => Promise<Result<TValue>>) {
    return new Promise<Result<TValue>>((resolve) => {
      fn()
        .then((result) => resolve(result))
        .catch((error) => resolve(Result.fromError(error)));
    });
  }

  get error(): TError {
    if (!this.isError()) {
      throw new Error("Result is not an error");
    }
    return this.#error!;
  }

  throwIfError<TOtherError extends TError>(
    error: MaybeFunction<TOtherError | string, [error: TError]> = (error) =>
      error as TOtherError,
  ): void {
    if (this.isError()) {
      throw toError(resolve(error, this.#error!));
    }
  }

  ifError(callback: (error: TError) => void): Result<TValue, TError> {
    if (this.isError()) {
      callback(this.#error!);
    }
    return this;
  }

  mapError<TNewError extends Error>(
    translateFn: MaybeFunction<TNewError | string, [error: TError]>,
  ): Result<TValue, TNewError | TError> {
    if (this.isError()) {
      return new Result<TValue, TNewError>(
        undefined,
        toError(resolve(translateFn, this.#error!)),
      );
    }
    return this;
  }

  logError(): Result<TValue, TError> {
    if (this.isError()) {
      console.error(this.#error);
    }
    return this;
  }

  get value(): TValue {
    this.throwIfError();
    return this.#value!;
  }

  get(): TValue {
    this.throwIfError();
    return this.#value!;
  }

  getOrElse<TElse>(
    defaultValue: MaybeFunction<TElse, [error: TError]>,
  ): TValue | TElse {
    if (this.isError()) {
      return resolve(defaultValue, this.error);
    }
    return this.#value!;
  }

  getOrNull(): TValue | null {
    if (this.isError()) {
      return null;
    }
    return this.#value!;
  }

  getOrUndefined(): TValue | undefined {
    if (this.isError()) {
      return undefined;
    }
    return this.#value!;
  }

  getOrThrow<TOtherError extends TError>(
    error: MaybeFunction<TOtherError | string, [error: TError]> = (error) =>
      error as TOtherError,
  ): TValue {
    this.throwIfError(error);
    return this.#value!;
  }

  isError(): boolean {
    return isDefined(this.#error);
  }
}

export function run<TValue>(fn: () => TValue): Result<TValue> {
  return Result.run(fn);
}

export function runAsync<TValue>(
  fn: () => Promise<TValue>,
): Promise<Result<TValue>> {
  return Result.runAsync(fn);
}
