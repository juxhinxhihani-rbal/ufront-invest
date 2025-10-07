// source: https://raw.githubusercontent.com/michaelwittig/node-i18n-iso-countries/master/langs/sq.json
import countryCodes from "./country-codes.json";

export function translateCountryCode(
  countryCode: string | undefined,
  lang: string
) {
  if (!countryCode) {
    return undefined;
  }

  if (lang === "sq") {
    const countries = countryCodes.countries as Record<string, string>;
    return countries[countryCode];
  }

  const displayNames = new Intl.DisplayNames(lang, { type: "region" });

  return displayNames.of(countryCode);
}
