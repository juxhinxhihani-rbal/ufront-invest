import { useCallback } from "react";
import { useMutation, useQuery } from "react-query";
import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import {
  activateAccount,
  closeAccount,
  createRetailAccount,
  createRetailAccountV2,
  fetchAccountCurrency,
  fetchAccountProducts,
  fetchRetailAccountDetails,
  fetchRetailAccountNumberList,
  updateAccount,
  uploadFiles,
} from "~/api/retailAccount/retailAccount";
import {
  AccountActivateResponse,
  AccountCloseDto,
  AccountCloseResponse,
  AccountCurrencyResponse,
  AccountDetailsDto,
  AccountProductResponse,
  AccountUpdateDto,
  AccountUpdateResponse,
  CreateRetailAccountResponse,
  RetailAccountNumberListDto,
} from "~/api/retailAccount/retailAccount.types";
import { RetailAccountFormValues } from "~/modules/CreateRetailAccount/types";
import { useFeatureFlags } from "../hooks/useFlags";

export function useReadAccountProductsQuery(
  customerSegmentId: number | undefined
) {
  const query = useQuery<AccountProductResponse[], HttpClientError>(
    ["AccountProduct", customerSegmentId],
    () => fetchAccountProducts(customerSegmentId ?? 0),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(customerSegmentId),
    }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useReadAccountCurrenciesQuery(
  productId: string,
  customerSegmentId: number | undefined
) {
  const query = useQuery<AccountCurrencyResponse, HttpClientError>(
    ["Currency", productId, customerSegmentId],
    () => fetchAccountCurrency(productId, customerSegmentId ?? 0),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(productId) && Boolean(customerSegmentId),
    }
  );

  const isDataEmpty = query.data?.currencies?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCreateRetailAccount(
  customerId: string,
  idempotencyKey: string
) {
  const { isFeatureEnabled } = useFeatureFlags();
  return useMutation<
    CreateRetailAccountResponse,
    HttpClientError,
    RetailAccountFormValues
  >({
    mutationFn: isFeatureEnabled("account_create_v2")
      ? (request) => createRetailAccountV2(customerId, request, idempotencyKey)
      : (request) => createRetailAccount(customerId, request, idempotencyKey),
  });
}

export function useGetRetailAccountDetails(accountId: number) {
  const query = useQuery<AccountDetailsDto, HttpClientError>(
    ["AccountDetails", accountId],
    () => fetchRetailAccountDetails(accountId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(accountId),
    }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useRetailAccountNumberListQuery(idParty?: number) {
  return useQuery<RetailAccountNumberListDto[], HttpClientError>(
    ["RetailAccountNumberList", idParty],
    () => fetchRetailAccountNumberList(idParty),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(idParty) }
  );
}

export function useUpdateAccountMutation(accountId: number) {
  return useMutation<AccountUpdateResponse, HttpClientError, AccountUpdateDto>({
    mutationFn: (values) => updateAccount(values, accountId),
  });
}

export function useCloseAccountMutation(accountId: number) {
  return useMutation<AccountCloseResponse, HttpClientError, AccountCloseDto>({
    mutationFn: (values) => closeAccount(values, accountId),
  });
}

export function useActivateAccountMutation() {
  return useMutation<AccountActivateResponse, HttpClientError, number>({
    mutationFn: (value) => activateAccount(value),
  });
}

export function useUploadFiles(customerId: string) {
  return useMutation<
    Response,
    HttpClientError,
    { formData: FormData; documentType?: number }
  >({
    mutationFn: (request) => uploadFiles(customerId, request),
  });
}
