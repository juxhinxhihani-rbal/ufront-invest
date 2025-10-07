/* eslint-disable no-irregular-whitespace */
import "jest";
import {
  formatAlbanianCurrency,
  formatAlbanianPreciseNumber,
  formatEnglishCurrency,
  formatEnglishPreciseNumber,
} from "./currency";

describe("Currency i18n tests", () => {
  test("Test format albanian currency", () => {
    // given:
    const value = 12312.0;
    // when:
    const result = formatAlbanianCurrency(value);
    // then:
    expect(result).toMatchInlineSnapshot(`"12,312.00 ALL"`);
  });

  test("Test format albanian precise number", () => {
    // given:
    const value = 1212.235;
    // when:
    const result = formatAlbanianPreciseNumber(value);
    // then:
    expect(result).toMatchInlineSnapshot(`"1,212.235000"`);
  });

  test("Test format english currency", () => {
    // given:
    const value = 12312.0;
    // when:
    const result = formatEnglishCurrency(value);
    // then:
    expect(result).toMatchInlineSnapshot(`"12,312.00 ALL"`);
  });

  test("Test format english precise number", () => {
    // given:
    const value = 1212.235;
    // when:
    const result = formatEnglishPreciseNumber(value);
    // then:
    expect(result).toMatchInlineSnapshot(`"1,212.235000"`);
  });
});
