/**
 * A wrapper for async functions that may throw errors of type E
 * This class preserves the type information of both the return value
 * and the potential error types
 * @template T The return type of the wrapped function
 * @template E The error type that may be thrown
 * @template Args The argument types of the wrapped function
 */
export class AsyncFnWithErr<
  T,
  E extends Error,
  Args extends readonly unknown[],
> {
  /**
   * @param fn The async function to wrap
   */
  constructor(public fn: (...args: Args) => Promise<T>) {}

  /**
   * The type of error that may be thrown by this function
   * This property is never actually used at runtime, it only exists for type information
   */
  readonly _errorType?: E;
}

/**
 * Creates an AsyncFnWithErr instance for a given async function, specifying the error type E
 * @template E The error type that may be thrown
 * @returns A function that wraps the provided async function
 * @example
 * ```typescript
 * const fetchUser = asyncFn<FetchError>()(async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   if (!response.ok) throw new FetchError('Failed to fetch user');
 *   return await response.json();
 * });
 * ```
 */
export function asyncFn<E extends Error>() {
  return <T, Args extends readonly unknown[]>(
    fn: (...args: Args) => Promise<T>
  ): AsyncFnWithErr<T, E, Args> => {
    return new AsyncFnWithErr<T, E, Args>(fn);
  };
}
