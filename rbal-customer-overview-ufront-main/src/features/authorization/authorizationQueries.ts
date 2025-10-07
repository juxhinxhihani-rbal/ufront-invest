import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useQuery } from "react-query";
import {
  fetchAmlDetails,
  fetchAuthorizationAccount,
  fetchAccountRightsChanges,
  fetchCustomerChanges,
  fetchCrsDetails,
} from "~/api/authorization/authorizationApi";
import {
  AuthorizableAccountDto,
  AuthorizationChangesResponse,
  AccountRightsAuthorizationResponse,
  AmlAuthorizationDetailsDto,
  CrsAuthorizationDetailsDto,
} from "~/api/authorization/authorizationApi.types";

export function useReadCustomerChangesQuery(customerId: string) {
  return useQuery<AuthorizationChangesResponse, HttpClientError>(
    ["ReadCustomerChanges", customerId],
    () => fetchCustomerChanges(customerId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useReadAuthorizationAccountQuery(accountId: string) {
  return useQuery<AuthorizableAccountDto, HttpClientError>(
    ["FetchAuthorizationAccount", accountId],
    () => fetchAuthorizationAccount(accountId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useReadAccountRightsAuthorizationQuery(
  authorizationRightListId: string
) {
  return useQuery<AccountRightsAuthorizationResponse, HttpClientError>(
    ["FetchAccountRights", authorizationRightListId],
    () => fetchAccountRightsChanges(authorizationRightListId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useReadAuthorizationAmlQuery(customerId: string) {
  return useQuery<AmlAuthorizationDetailsDto, HttpClientError>(
    ["FetchAuthorizationAml", customerId],
    () => fetchAmlDetails(customerId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useReadAuthorizationCrsQuery(customerId: string) {
  return useQuery<CrsAuthorizationDetailsDto, HttpClientError>(
    ["FetchAuthorizationCrs", customerId],
    () => fetchCrsDetails(customerId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}
