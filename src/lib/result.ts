import { isDefined, isFunction, isString } from "./helpers";

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
    return new Result<TValue, TResError>(
      undefined,
      (isString(error) ? new Error(error) : error) as TResError,
    );
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

  get error(): TError {
    if (!this.isError()) {
      throw new Error("Result is not an error");
    }
    return this.#error!;
  }

  throwIfError(
    transformError: (error: TError) => TError = (error) => error,
  ): void {
    if (this.isError()) {
      throw transformError(this.#error!);
    }
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
    defaultValue: ((error: TError) => TElse) | TElse,
  ): TValue | TElse {
    if (this.isError()) {
      if (isFunction(defaultValue)) {
        return defaultValue(this.error);
      } else {
        return defaultValue;
      }
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

  getOrThrow(
    transformError: (error: TError) => TError = (error) => error,
  ): TValue {
    this.throwIfError(transformError);
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
