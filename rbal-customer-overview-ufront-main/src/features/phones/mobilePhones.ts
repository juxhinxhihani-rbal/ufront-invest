import libPhoneParsePhoneNumber from "libphonenumber-js";

interface ParsePhoneNumberResult {
  isValid: boolean;
  formatted: string;
  countryCodes: string[];
}

export function parsePhoneNumber(
  input: string | undefined | null
): ParsePhoneNumberResult | undefined {
  if (!input) {
    return undefined;
  }

  // input must have a "+"" at the beginning to ensure
  // proper detection of the country prefix
  const value = input.startsWith("+") ? input : `+${input}`;

  const result = libPhoneParsePhoneNumber(value, "AL");

  if (!result) {
    return undefined;
  }

  return {
    isValid: result.isValid(),
    formatted: result.formatInternational(),
    countryCodes: result.getPossibleCountries() as string[],
  };
}
