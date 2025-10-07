import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";

export function fetchMidasDate(): Promise<string> {
  return advisedFetch(`/api/customer-overview/midas/date`).then(
    jsonErrorHandler()
  );
}
