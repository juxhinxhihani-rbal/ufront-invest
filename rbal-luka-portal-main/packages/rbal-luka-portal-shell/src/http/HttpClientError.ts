export class HttpClientError extends Error {
  public readonly code: string;
  public readonly url: string;
  public readonly title?: string | string[];

  constructor(code: string, url: string, title?: string, opts?: ErrorOptions) {
    super(`An error with code: ${code} occured, calling ${url}`, opts);
    this.code = code;
    this.url = url;
    this.title = title;
    Object.setPrototypeOf(this, HttpClientError.prototype);
  }
}
