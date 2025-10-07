import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useQuery } from "react-query";
import { fetchMidasDate } from "~/api/midas/midasApi";

export function useMidasDateQuery() {
  return useQuery<string, HttpClientError>(
    ["MidasDateQuery"],
    () => fetchMidasDate(),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}
