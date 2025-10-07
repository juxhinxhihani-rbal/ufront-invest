import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { fetchWalkInCustomer } from "~/api/walkInCustomer/walkInCustomerApi";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";

export function useReadWalkInCustomerQuery(customerId: string | undefined) {
  const query = useQuery<WalkInCustomerDto, HttpClientError>(
    ["ReadWalkInCustomer", customerId],
    () => fetchWalkInCustomer(customerId ?? "none"),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}
