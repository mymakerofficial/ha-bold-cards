export type ErrorResult = {
  error: true;
  message: string;
};

export type SuccessResult<T> = {
  error: false;
  value: T;
};

export type Result<T> = ErrorResult | SuccessResult<T>;

export function errorResult(message: string): ErrorResult {
  return { error: true, message };
}

export function successResult<T>(value: T): SuccessResult<T> {
  return { error: false, value };
}

export function isErrorResult<T>(result: Result<T>): result is ErrorResult {
  return result.error;
}

export function isSuccessResult<T>(
  result: Result<T>,
): result is SuccessResult<T> {
  return !result.error;
}

export function resolveResult<T>(
  result: Result<T>,
  transformError: (error: string) => string = (error) => error,
): T {
  if (isErrorResult(result)) {
    throw new Error(transformError(result.message));
  }

  return result.value;
}

export function run<T>(fn: () => T): Result<T> {
  try {
    return successResult(fn());
  } catch (error) {
    return errorResult((error as Error).message);
  }
}
