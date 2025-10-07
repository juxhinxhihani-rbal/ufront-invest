import { HttpClientError } from "./HttpClientError";

function is4xxError(statusCode: number) {
  return statusCode >= 400 && statusCode < 500;
}

function is5xxError(statusCode: number) {
  return statusCode >= 500 && statusCode < 600;
}

export function jsonErrorHandler<T = unknown>() {
  return async (response: Response) => {
    if (is5xxError(response.status)) {
      void response.json();
      throw new HttpClientError("server-error", response.url);
    }

    if (is4xxError(response.status)) {
      let errorJson;
      try {
        errorJson = await response.json();
      } catch (err) {
        throw new HttpClientError("content-not-json", response.url);
      }

      if (typeof errorJson.type === "string") {
        throw new HttpClientError(
          errorJson.type,
          response.url,
          errorJson.title
        );
      }

      throw new HttpClientError("client-error", response.url);
    }

    if (!response.headers.get("Content-Type")?.includes("json")) {
      throw new HttpClientError("content-not-json", response.url);
    }

    return response.json() as Promise<T>;
  };
}
