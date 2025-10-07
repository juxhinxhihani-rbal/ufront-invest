import dayjs from "dayjs";

export function formatIntlLocalDate(
  isoDate: string | undefined,
  // Optional language for the formatting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _lang = "sq"
): string | undefined {
  if (!isoDate) {
    return undefined;
  }

  return dayjs(isoDate).format("DD/MM/YYYY");
}

export function formatIntlLocalDateTime(
  isoDate: string | undefined,
  // Optional language for the formatting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _lang = "sq"
): string | undefined {
  if (!isoDate) {
    return undefined;
  }

  return dayjs(isoDate).format("DD/MM/YYYY HH:mm");
}
