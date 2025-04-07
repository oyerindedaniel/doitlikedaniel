/**
 * A wrapper for synchronous functions that may throw errors of type E
 * @template T The return type of the wrapped function
 * @template E The error type that may be thrown
 * @template Args The argument types of the wrapped function
 */
export class SyncFnWithErr<
  T,
  E extends Error,
  Args extends readonly unknown[],
> {
  constructor(public fn: (...args: Args) => T) {}

  /**
   * Type marker for the error type (for type information only)
   */
  readonly _errorType?: E;
}

/**
 * Creates a SyncFnWithErr instance for a synchronous function, specifying the error type E
 * @template E The error type that may be thrown
 * @returns A function that wraps the provided synchronous function
 * @example
 * const parseJson = syncFn<SyntaxError>()((text: string) => JSON.parse(text));
 */
export function syncFn<E extends Error>() {
  return <T, Args extends readonly unknown[]>(
    fn: (...args: Args) => T
  ): SyncFnWithErr<T, E, Args> => {
    return new SyncFnWithErr<T, E, Args>(fn);
  };
}
