import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useCallback } from "react";
import { useQuery } from "react-query";
import {
  fetchAccountsForBlockRequest,
  fetchAccountsForInputRequest,
  fetchAccountsForTemporaryUnblockRequest,
  fetchAccountsForUnblockRequest,
  fetchRequestsForReverseHeldItem,
} from "~/api/manageAccounts/manageAccountsApi";
import {
  AccountForInputRequest,
  RequestsStatusListItem,
  SendRequestProcessParams,
  TemporaryUnblockRequestItem,
  ReverseHeldItemsList,
  UnblockRequestsForProcessItem,
} from "~/api/manageAccounts/manageAccountsApi.types";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";

export function useAccountsForInputRequestQuery(customerId?: string) {
  const query = useQuery<AccountForInputRequest[], HttpClientError>(
    ["AccountsForInputRequest", customerId],
    () => fetchAccountsForInputRequest(customerId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAccountsForBlockRequestQuery(
  filters?: SendRequestProcessParams
) {
  const query = useQuery<RequestsStatusListItem[], HttpClientError>(
    ["AccountsForBlockRequest", filters],
    () => fetchAccountsForBlockRequest(filters),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useAccountsForTemporaryUnblockRequestQuery() {
  const query = useQuery<TemporaryUnblockRequestItem[], HttpClientError>(
    ["AccountsForTemporaryUnblockRequest"],
    () => fetchAccountsForTemporaryUnblockRequest(),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useAccountsForUnblockRequestQuery(
  filters?: SendRequestProcessParams
) {
  const query = useQuery<UnblockRequestsForProcessItem[], HttpClientError>(
    ["AccountsForUnblockRequest", filters],
    () => fetchAccountsForUnblockRequest(filters),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useRequestsForReverseHeldItemQuery(
  listCustomersParams: ListCustomersParams
) {
  const query = useQuery<ReverseHeldItemsList[], HttpClientError>(
    ["RequestsForReverseHeldItem"],
    () => fetchRequestsForReverseHeldItem(listCustomersParams),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}
