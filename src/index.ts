export interface Success<S> {
  readonly value: S,
  isSuccess(): this is Success<S>,
  isFail(): false,
  ifSuccess<R>(fn: (value: S) => R): Success<R>,
  ifFail(): Success<S>,
}

export interface Fail<F> {
  readonly error: F,
  isSuccess(): false,
  isFail(): this is Fail<F>,
  ifSuccess(): Fail<F>,
  ifFail<R>(fn: (error: F) => R): Fail<R>,
}

export type Frail<S, F> = Success<S> | Fail<F>;

export const success = <S>(value: S): Success<S> => {
  const result: Success<S> = {
    value,
    isSuccess: () => true,
    isFail: () => false,
    ifSuccess: <R>(fn: (value: S) => R): Success<R> => success(fn(value)),
    ifFail: (): Success<S> => result,
  };
  return result;
}

export const fail = <F>(error: F): Fail<F> => {
  const result: Fail<F> = {
    error,
    isSuccess: () => false,
    isFail: () => true,
    ifSuccess: (): Fail<F> => result,
    ifFail: <S>(fn: (error: F) => S): Fail<S> => fail(fn(error)),
  };
  return result;
}
