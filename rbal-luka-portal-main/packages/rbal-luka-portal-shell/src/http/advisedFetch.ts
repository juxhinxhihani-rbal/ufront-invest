import { HttpClientError } from "./HttpClientError";

export type FetchFn = typeof fetch;

/**
 * Options for the advised fetch
 */
export interface AdvisedFetchOptions {
  /**
   * Optional request timeout in milliseconds
   * @default 15_000
   */
  timeoutMs?: number;

  /**
   * Optional abort controller for manual request cancellation
   */
  abortController?: AbortController;
}

export interface AdvisedFetch extends FetchFn {
  (
    input: RequestInfo | URL,
    init?: RequestInit,
    opts?: AdvisedFetchOptions
  ): Promise<Response>;
}

/**
 * A factory for fetch-compatible function with timeouts handling
 * @param opts options to bind
 */
export const createAdvisedFetch =
  (opts: AdvisedFetchOptions): typeof fetch =>
  (input, init) =>
    advisedFetch(input, init, opts);

/**
 * A fetch-compatible function, extended with timeouts handling
 * @see {AdvisedFetchOptions}
 */
export const advisedFetch: AdvisedFetch = (
  input,
  init,
  opts: AdvisedFetchOptions = { timeoutMs: 15_000 }
) => {
  const requestInit: RequestInit = { ...init };

  if (opts.timeoutMs) {
    const abortController = opts.abortController ?? new AbortController();
    requestInit.signal = abortController.signal;

    const timeoutId = setTimeout(() => abortController.abort(), opts.timeoutMs);

    return fetch(input, requestInit)
      .catch(abortedErrorHandler(input.toString()))
      .finally(() => clearTimeout(timeoutId));
  }

  return fetch(input, requestInit);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function abortedErrorHandler(url: string): (reason: any) => Promise<never> {
  return (err) => {
    if (err.name === "AbortError") {
      return Promise.reject(
        new HttpClientError("aborted", url, undefined, { cause: err })
      );
    }

    return Promise.reject(err);
  };
}
