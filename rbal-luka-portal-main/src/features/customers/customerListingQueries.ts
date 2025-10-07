import { useCallback } from "react";
import { useQuery, UseQueryOptions } from "react-query";
import { fetchCustomersListing } from "~/api/customerApi";
import { CustomerListing, ListCustomersParams } from "~/api/customerApi.types";

export function useListCustomersQuery(
  listCustomersParams: ListCustomersParams,
  configOverride: UseQueryOptions<
    CustomerListing,
    unknown,
    CustomerListing,
    unknown[]
  >
) {
  const query = useQuery(
    ["ListCustomers", listCustomersParams] as unknown[],
    () => fetchCustomersListing(listCustomersParams),
    {
      refetchOnWindowFocus: false,
      ...configOverride,
    }
  );
  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}
