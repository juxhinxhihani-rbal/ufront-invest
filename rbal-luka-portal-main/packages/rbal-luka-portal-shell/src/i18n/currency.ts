const investmentNumberFormat = new Intl.NumberFormat("en", {
  maximumFractionDigits: 6,
  minimumFractionDigits: 6,
});

export function formatAlbanianCurrency(
  value: number,
  currency = "ALL"
): string {
  const numericPart = value.toLocaleString("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return numericPart + "\u00a0" + currency;
}

export function formatEnglishPreciseNumber(value: number): string {
  return investmentNumberFormat.format(value);
}

export function formatAlbanianPreciseNumber(value: number): string {
  return investmentNumberFormat.format(value);
}

export function formatEnglishCurrency(value: number, currency = "ALL"): string {
  const numericPart = value.toLocaleString("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return numericPart + "\u00a0" + currency;
}
