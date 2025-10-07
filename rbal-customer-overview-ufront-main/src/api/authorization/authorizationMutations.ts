import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  activateMidasCustomer,
  approveAccountChanges,
  approveAccountRightsChanges,
  approveAmlChanges,
  approveCrsChanges,
  approveCustomerChanges,
  approveDigitalBankingChanges,
  authorizeOrRejectSpecimenSignature,
  rejectAccountChanges,
  rejectAccountRightsChanges,
  rejectAmlChanges,
  rejectCrsChanges,
  rejectCustomerChanges,
  rejectDigitalBankingChanges,
} from "./authorizationApi";
import {
  RejectCustomerChangesResponse,
  CustomerAuthorizeResponse,
  ActivateMidasCustomerResponse,
  AuthorizeSpecimenResponse,
  AccountAuthorizationResponse,
  AccountRejectionResponse,
  AccountRightsApprovedResponse,
  AccountRightsRejectionResponse,
  AmlAuthorizationResponse,
  AmlRejectionResponse,
  CrsAuthorizationResponse,
  CrsRejectionResponse,
} from "./authorizationApi.types";

export function useRejectCustomerChanges() {
  return useMutation<RejectCustomerChangesResponse, HttpClientError, string>({
    mutationFn: (customerId) => rejectCustomerChanges(customerId),
  });
}

export function useApproveCustomerChanges() {
  return useMutation<CustomerAuthorizeResponse, HttpClientError, string>({
    mutationFn: (customerId) => approveCustomerChanges(customerId),
  });
}

export function useActivateMidasCustomer() {
  return useMutation<
    ActivateMidasCustomerResponse,
    HttpClientError,
    { customerId: string; isActivated: boolean }
  >({
    mutationFn: ({ customerId, isActivated }) =>
      activateMidasCustomer(customerId, isActivated),
  });
}

export function useAuthorizeOrRejectSpecimenSignature() {
  return useMutation<
    AuthorizeSpecimenResponse,
    HttpClientError,
    { customerId: string; isApproved: boolean }
  >({
    mutationFn: ({ customerId, isApproved }) =>
      authorizeOrRejectSpecimenSignature(customerId, isApproved),
  });
}

export function useApproveAccountChanges() {
  return useMutation<AccountAuthorizationResponse, HttpClientError, string>({
    mutationFn: (accountId) => approveAccountChanges(accountId),
  });
}

export function useRejectAccountChanges() {
  return useMutation<AccountRejectionResponse, HttpClientError, string>({
    mutationFn: (accountId) => rejectAccountChanges(accountId),
  });
}

export function useApproveAccountRightsChanges() {
  return useMutation<AccountRightsApprovedResponse, HttpClientError, string>({
    mutationFn: (authorizationRightListId) =>
      approveAccountRightsChanges(authorizationRightListId),
  });
}

export function useRejectAccountRightsChanges() {
  return useMutation<AccountRightsRejectionResponse, HttpClientError, string>({
    mutationFn: (authorizationRightListId) =>
      rejectAccountRightsChanges(authorizationRightListId),
  });
}

export function useApproveDigitalBankingChanges() {
  return useMutation<
    boolean,
    HttpClientError,
    { applicationId: string; customerId: string }
  >({
    mutationFn: ({ applicationId, customerId }) =>
      approveDigitalBankingChanges(applicationId, customerId),
  });
}

export function useRejectDigitalBankingChanges() {
  return useMutation<boolean, HttpClientError, string>({
    mutationFn: (applicationId) => rejectDigitalBankingChanges(applicationId),
  });
}

export function useApproveAmlChanges() {
  return useMutation<
    AmlAuthorizationResponse,
    HttpClientError,
    { customerId: string; description: string; expireDate: string }
  >({
    mutationFn: ({ customerId, description, expireDate }) =>
      approveAmlChanges(customerId, description, expireDate),
  });
}

export function useRejectAmlChanges() {
  return useMutation<
    AmlRejectionResponse,
    HttpClientError,
    { customerId: string; description: string }
  >({
    mutationFn: ({ customerId, description }) =>
      rejectAmlChanges(customerId, description),
  });
}

export function useApproveCrsChanges() {
  return useMutation<CrsAuthorizationResponse, HttpClientError, string>({
    mutationFn: (customerId) => approveCrsChanges(customerId),
  });
}

export function useRejectCrsChanges() {
  return useMutation<
    CrsRejectionResponse,
    HttpClientError,
    { customerId: string; description: string }
  >({
    mutationFn: ({ customerId, description }) =>
      rejectCrsChanges(customerId, description),
  });
}
