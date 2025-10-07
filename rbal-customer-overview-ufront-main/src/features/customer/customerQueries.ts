import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import {
  fetchCustomer,
  fetchCustomerAuthorizedPersons,
  fetchCustomerRetailAccounts,
  fetchCustomerDocumentList,
  fetchCustomerRetailAccountsBalances,
  fetchCustomersListing,
  fetchCustomerStatus,
  resegmentCustomer,
  updateCustomerChargeAccount,
  checkResegmentStatus,
  fetchAuthorizedRights,
  fetchAllRights,
  updateAuthorizedRights,
  revokeAuthorizedPerson,
  checkAuthorizedPersonStatus,
  addCustomerAuthorizedPersons,
  fetchAuthorizationCustomerList,
  fetchAuthorizationSpecimenList,
  fetchCustomerAvailableForAuthorizationRetailAccounts,
  fetchCustomerSpecimen,
  uploadCustomerSpecimen,
  fetchCustomerSpecimenDetails,
  fetchCustomerRetailAccountsAuthorizedByPerson,
  fetchAuthorizationAccountList,
  fetchDigitalBanking,
  fetchAccountRightsAuthorizationList,
  fetchCustomerChargeableRetailAccounts,
  fetchDigitalAuthorizationList,
  fetchAmlAuthorizationList,
  fetchAvailableCustomerDocuments,
  fetchCrsAuthorizationList,
} from "~/api/customer/customerApi";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDocumentListResponse,
  CustomerListingItem,
  ReadAccountBalancesResponse,
  CustomerDto,
  CustomerResegmentationProcessDto,
  CustomerRetailAccount,
  AccountRightsDto,
  AccountRightsInfo,
  CustomerType,
  AccountRightUpdateDto,
  SignatureStatusCode,
  CustomerStatusDto,
  AuthorizationCustomersListResponse,
  AuthorizationSpecimenListResponse,
  CustomerSpecimenResponse,
  AuthorizationAccountListResponse,
  DigitalBankingDto,
  AccountRightsAuthorizationListResponse,
  UpdateCustomerChargeAccountResponse,
  DigitalAuthorizationListResponse,
  AmlAuthorizationListResponse,
  AvailableCustomerDocument,
  CrsAuthorizationListResponse,
  RefetchIntervalParam,
} from "~/api/customer/customerApi.types";
import { ListCustomersParams } from "../../modules/CustomerListingPage/types";
import { ResegmentationStatusResponse } from "~/api/retailAccount/retailAccount.types";
import { LegalValidationErrors } from "~/modules/EditCustomer/types";
import {
  DefaultAccountAuthorizationFiltersParams,
  DefaultAccountRightsAuthorizationFiltersParams,
  DefaultAmlAuthorizationFiltersParams,
  DefaultCrsAuthorizationFiltersParams,
  DefaultCustomerAuthorizationFiltersParams,
  DefaultDigitalAuthorizationFiltersParams,
  DefaultSpecimenAuthorizationFiltersParams,
} from "~/modules/Authorization/types";
import { SpecimenDetailsDto } from "~/api/authorization/authorizationApi.types";

export function useListCustomersQuery(
  listCustomersParams: ListCustomersParams,
  isForWalkInSearch?: boolean
) {
  const query = useQuery<CustomerListingItem[], HttpClientError>(
    ["ListCustomers", listCustomersParams],
    () => fetchCustomersListing(listCustomersParams, isForWalkInSearch),
    {
      enabled: !areListCustomersParamsEmpty(listCustomersParams),
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useReadCustomerQuery(
  customerId: string | undefined,
  refetchInterval?: RefetchIntervalParam<CustomerDto>
) {
  const query = useQuery<CustomerDto, HttpClientError>(
    ["ReadCustomer", customerId],
    () => fetchCustomer(customerId ?? "none"),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(customerId),
      refetchInterval,
    }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useCustomerRetailAccountsQuery(customerId?: number) {
  const query = useQuery<CustomerRetailAccount[], HttpClientError>(
    ["CustomerRetailAccounts", customerId],
    () => fetchCustomerRetailAccounts(customerId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCustomerChargeableRetailAccountsQuery(
  customerId?: number,
  segmentId?: number
) {
  const query = useQuery<CustomerRetailAccount[], HttpClientError>(
    ["CustomerChargeableRetailAccounts", customerId],
    () => fetchCustomerChargeableRetailAccounts(customerId, segmentId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCustomerRetailAccountsAuthorizedByPersonQuery(
  customerId?: number,
  authorizedPersonId?: number,
  enabled?: boolean
) {
  const query = useQuery<CustomerRetailAccount[], HttpClientError>(
    ["AuthorizedCustomerRetailAccounts", customerId, authorizedPersonId],
    () =>
      fetchCustomerRetailAccountsAuthorizedByPerson(
        customerId,
        authorizedPersonId
      ),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(customerId && authorizedPersonId) && enabled,
    }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCustomerRetailAccountsAvailableForAuthorizationQuery(
  customerId?: number,
  otherPersonId?: number,
  enabled = true
) {
  const query = useQuery<CustomerRetailAccount[], HttpClientError>(
    ["AvailableForAuthorizationRetailAccounts", customerId],
    () =>
      fetchCustomerAvailableForAuthorizationRetailAccounts(
        customerId,
        otherPersonId
      ),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(customerId) && enabled,
    }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useUpdateCustomerChargeAccount() {
  return useMutation<
    UpdateCustomerChargeAccountResponse,
    HttpClientError,
    { productId: number; customerId?: string }
  >({
    mutationFn: (values) =>
      updateCustomerChargeAccount(values.productId, values.customerId),
  });
}

export interface BalanceItem {
  balance?: number;
  status: "success" | "loading" | "error";
}

const AUTO_FETCHED_BALANCED_COUNT = 3;

export function useReadCustomerRetailAccountsBalancesQuery(
  customerId: number,
  allAccountNumbers: string[]
) {
  const [balances, setBalances] = useState({} as Record<string, BalanceItem>);

  const query = useMutation<
    ReadAccountBalancesResponse,
    HttpClientError,
    string[]
  >({
    mutationFn: (accountNumbers) => {
      const nextBalances = { ...balances };
      for (const accountNo of accountNumbers) {
        nextBalances[accountNo] = { status: "loading" };
      }
      setBalances(nextBalances);

      return fetchCustomerRetailAccountsBalances(customerId, accountNumbers);
    },
    onError(_, requestedAccounts) {
      const nextBalances = { ...balances };
      for (const accountNo of requestedAccounts) {
        nextBalances[accountNo] = { status: "error" };
      }
      setBalances(nextBalances);
    },
    onSuccess(fetchedBalances) {
      const nextBalances = { ...balances };
      for (const item of fetchedBalances) {
        nextBalances[item.retailAccountNumber] = {
          balance: item.balance,
          status: "success",
        };
      }
      setBalances(nextBalances);
    },
  });

  useEffect(() => {
    const initialAccounts = allAccountNumbers.slice(
      0,
      AUTO_FETCHED_BALANCED_COUNT
    );

    if (initialAccounts.length > 0 && query.isIdle) {
      query.mutate(initialAccounts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAccountNumbers]);

  const missingBalances = useMemo(
    () =>
      allAccountNumbers.filter(
        (accountNumber) => balances[accountNumber]?.status !== "success"
      ),
    [allAccountNumbers, balances]
  );

  const fetchMissingBalances = useCallback(() => {
    query.mutate(missingBalances);
  }, [missingBalances, query]);

  return { query, balances, missingBalances, fetchMissingBalances };
}

export function useCustomerAuthorizedPersonsQuery(
  customerId?: number,
  enabled = true
) {
  const query = useQuery<CustomerAuthorizedPersonsResponse[], HttpClientError>(
    ["CustomerAuthorizedPersons", customerId],
    () => fetchCustomerAuthorizedPersons(customerId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(customerId) && enabled,
    }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAddCustomerAuthorizedPersonsQuery(
  customerId?: number,
  authorizedPersonsId?: number
) {
  return useMutation<undefined, HttpClientError, undefined>({
    mutationFn: () =>
      addCustomerAuthorizedPersons(customerId, authorizedPersonsId),
  });
}

export function useAllAccountRights(type?: CustomerType) {
  const query = useQuery<AccountRightsInfo[], HttpClientError>(
    ["AccountRights"],
    () => fetchAllRights(type),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
  const isDataEmpty = query.data ?? false;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAuthorizedRightsQuery(
  onSuccess: (data: AccountRightsDto) => void,
  customerId?: number,
  authorizedPersonsId?: number
) {
  const query = useQuery<AccountRightsDto, HttpClientError>(
    ["AuthorizedRights", customerId],
    () => fetchAuthorizedRights(customerId, authorizedPersonsId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(authorizedPersonsId),
      onSuccess,
    }
  );

  const isDataEmpty = Object.keys(query.data ?? {}).length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useUpdateAuthorizedRightsQuery(
  customerId?: number,
  authorizedPersonsId?: number
) {
  return useMutation<Response, HttpClientError, AccountRightUpdateDto>({
    mutationFn: (values) =>
      updateAuthorizedRights(values, customerId, authorizedPersonsId),
  });
}

export function useCustomerDocumentListQuery(
  customerId?: number,
  categoryType?: number,
  documentType?: number
) {
  const query = useQuery<CustomerDocumentListResponse[], HttpClientError>(
    ["CustomerDocumentList", customerId, categoryType, documentType],
    () => fetchCustomerDocumentList(customerId, categoryType, documentType),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAvailableCustomerDocumentsQuery(customerId?: number) {
  const query = useQuery<AvailableCustomerDocument[], HttpClientError>(
    ["AvailableCustomerDocuments", customerId],
    () => fetchAvailableCustomerDocuments(customerId),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const isDataEmpty = query.data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCustomerStatusQuery(
  customerId?: string,
  shouldCheckStatus?: boolean,
  onSuccess?: (data: CustomerStatusDto) => void
) {
  const query = useQuery<CustomerStatusDto, HttpClientError>(
    ["CustomerStatus", customerId],
    () => fetchCustomerStatus(customerId),
    {
      refetchInterval: 3000,
      refetchOnMount: false,
      retry: false,
      enabled: Boolean(customerId) && shouldCheckStatus,
      onSuccess(data) {
        onSuccess?.(data);
      },
    }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function areListCustomersParamsEmpty(
  formValues: ListCustomersParams
): boolean {
  return !Object.entries(formValues).some(([, value]) => Boolean(value));
}

export function useResegmentCustomer(customerId?: string) {
  return useMutation<
    Response,
    HttpClientError & { code: LegalValidationErrors },
    CustomerResegmentationProcessDto
  >({
    mutationFn: (values) => resegmentCustomer(values, customerId),
  });
}

export function useCheckResegmentationStatus(
  onSuccess: (data: ResegmentationStatusResponse) => void,
  queried: boolean,
  customerId?: number,
  customerSegmentId?: number,
  onError?: (error: HttpClientError) => void
) {
  return useQuery<ResegmentationStatusResponse, HttpClientError>(
    ["CheckResegmentationStatus", customerId],
    () => checkResegmentStatus(customerId, customerSegmentId),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: queried && Boolean(customerId) && Boolean(customerSegmentId),
      onSuccess,
      onError,
    }
  );
}

export function useRevokeAuthorizedPerson(customerId?: string) {
  return useMutation<
    Response,
    HttpClientError,
    { authorizedPersonIdParty: number }
  >({
    mutationFn: (values) =>
      revokeAuthorizedPerson(customerId, values.authorizedPersonIdParty),
  });
}

export function useCheckAuthorizedPersonStatus(
  customerId?: number,
  authorizedPersonIdParty?: number,
  shouldCheckStatus?: boolean,
  onSuccess?: (data: SignatureStatusCode) => void
) {
  const query = useQuery<SignatureStatusCode, HttpClientError>(
    ["AuthorizedPersonStatus", customerId, authorizedPersonIdParty],
    () => checkAuthorizedPersonStatus(customerId, authorizedPersonIdParty),
    {
      refetchInterval: 3000,
      refetchOnMount: false,
      retry: false,
      enabled:
        Boolean(customerId) &&
        Boolean(authorizedPersonIdParty) &&
        shouldCheckStatus,
      onSuccess(data) {
        onSuccess?.(data);
      },
    }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useAuthorizationCustomerListQuery(
  filters: DefaultCustomerAuthorizationFiltersParams
) {
  const query = useQuery<AuthorizationCustomersListResponse, HttpClientError>(
    ["AuthorizationCustomerList", filters],
    () => fetchAuthorizationCustomerList(filters),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(filters.branchId),
    }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAuthorizationSpecimenListQuery(
  filters: DefaultSpecimenAuthorizationFiltersParams
) {
  const query = useQuery<AuthorizationSpecimenListResponse, HttpClientError>(
    ["AuthorizationSpecimenList", filters],
    () => fetchAuthorizationSpecimenList(filters),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAccountAuthorizationListQuery(
  filters: DefaultAccountAuthorizationFiltersParams
) {
  const query = useQuery<AuthorizationAccountListResponse, HttpClientError>(
    ["AuthorizationAccountList", filters],
    () => fetchAuthorizationAccountList(filters),
    { refetchOnWindowFocus: false, retry: 1 }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data?.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAccountRightsAuthorizationListQuery(
  filters: DefaultAccountRightsAuthorizationFiltersParams
) {
  const query = useQuery<
    AccountRightsAuthorizationListResponse,
    HttpClientError
  >(
    ["AccountRightsList", filters],
    () => fetchAccountRightsAuthorizationList(filters),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(filters.branchId),
    }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useDigitalAuthorizationListQuery(
  filters: DefaultDigitalAuthorizationFiltersParams
) {
  const query = useQuery<DigitalAuthorizationListResponse, HttpClientError>(
    ["DigitalList", filters],
    () => fetchDigitalAuthorizationList(filters),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(filters.idBranch),
    }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useAmlAuthorizationListQuery(
  filters: DefaultAmlAuthorizationFiltersParams
) {
  const query = useQuery<AmlAuthorizationListResponse, HttpClientError>(
    ["AmlList", filters],
    () => fetchAmlAuthorizationList(filters),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(filters.branchId),
    }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCrsAuthorizationListQuery(
  filters: DefaultCrsAuthorizationFiltersParams
) {
  const query = useQuery<CrsAuthorizationListResponse, HttpClientError>(
    ["CrsList", filters],
    () => fetchCrsAuthorizationList(filters),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: Boolean(filters.branchId),
    }
  );

  const data = query.data?.response ?? [];
  const isDataEmpty = data.length === 0;

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, isDataEmpty, refresh };
}

export function useCustomerSpecimenDetails(customerId: string) {
  const query = useQuery<SpecimenDetailsDto, HttpClientError>(
    ["CustomerSpecimenDetails", customerId],
    () => fetchCustomerSpecimenDetails(customerId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}

export function useCustomerSpecimenQuery(customerId?: string) {
  return useQuery<CustomerSpecimenResponse, HttpClientError>(
    ["CustomerSpecimen", customerId],
    () => fetchCustomerSpecimen(customerId),
    {
      refetchOnWindowFocus: false,
      enabled: Boolean(customerId),
      retry: 1,
    }
  );
}

export function useUploadCustomerSpecimen(customerId: string) {
  return useMutation<
    boolean,
    HttpClientError,
    { formData: FormData; description?: string }
  >({
    mutationFn: (request) => uploadCustomerSpecimen(customerId, request),
  });
}

export function useReadDigitalBankingQuery(customerId: string | undefined) {
  const query = useQuery<DigitalBankingDto, HttpClientError>(
    ["ReadDigitalBanking", customerId],
    () => fetchDigitalBanking(customerId ?? "none"),
    { refetchOnWindowFocus: false, retry: 1, enabled: Boolean(customerId) }
  );

  const refresh = useCallback(() => {
    void query.refetch();
  }, [query]);

  return { query, refresh };
}
