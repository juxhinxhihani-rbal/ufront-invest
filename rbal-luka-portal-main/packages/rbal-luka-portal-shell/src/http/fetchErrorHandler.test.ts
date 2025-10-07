import "isomorphic-fetch";
import { jsonErrorHandler } from "./fetchErrorHandler";
import { HttpClientError } from "./HttpClientError";

describe("fetchErrorHandler tests", () => {
  test("Test invalid content type", async () => {
    // given:
    const response = new Response("<div>Html!</div>", {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
    const handler = jsonErrorHandler<HttpClientError>();
    // when:
    const result = await handler(response).catch((err) => err);
    // then:
    expect(result.code).toBe("content-not-json");
  });

  test("Test 404 error with dedicated content type", async () => {
    // given:
    const response = new Response('{ "type": "missing-resource" }', {
      status: 404,
      headers: {
        "Content-Type": "application/problem+json",
      },
    });
    const handler = jsonErrorHandler<HttpClientError>();
    // when:
    const result = await handler(response).catch((err) => err);
    // then:
    expect(result.code).toBe("missing-resource");
  });

  test("Test valid response", async () => {
    // given:
    const responseBody = { id: "random-id" };
    const response = new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const handler = jsonErrorHandler<Record<string, string>>();
    // when:
    const result = await handler(response);
    // then:
    expect(result).toMatchObject(responseBody);
  });

  test("Test server error", async () => {
    // given:
    const response = new Response("{}", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const handler = jsonErrorHandler<HttpClientError>();
    // when:
    const result = await handler(response).catch((err) => err);
    // then:
    expect(result.code).toBe("server-error");
  });
});
