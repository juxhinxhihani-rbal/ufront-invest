import { formatIntlLocalDate, formatIntlLocalDateTime } from "./dates";

describe("Dates i18n tests", () => {
  test("Test intl local date format", () => {
    // given:
    const isoTemporals = ["2021-12-11T12:00:00Z", "2021-12-11", undefined];
    // when:
    const result = isoTemporals.map((isoTemporal) =>
      formatIntlLocalDate(isoTemporal)
    );
    // then:
    expect(result).toMatchInlineSnapshot(`
      [
        "11/12/2021",
        "11/12/2021",
        undefined,
      ]
    `);
  });

  test("Test intl local date time format", () => {
    // given:
    const isoTemporals = [
      "2021-12-11T15:00:00Z",
      "1995-12-11T17:00:00Z",
      undefined,
    ];
    // when:
    const result = isoTemporals.map((isoTemporal) =>
      formatIntlLocalDateTime(isoTemporal)
    );
    // then:
    expect(result).toMatchInlineSnapshot(`
      [
        "11/12/2021 16:00",
        "11/12/1995 18:00",
        undefined,
      ]
    `);
  });
});
