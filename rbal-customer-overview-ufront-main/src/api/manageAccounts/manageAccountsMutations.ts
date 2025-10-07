import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useMutation } from "react-query";
import {
  blockAccount,
  blockProcessRequest,
  fetchRequestsForBlockRequestsStatus,
  fetchRequestsForUnblockRequestsStatus,
  cancelTemporaryUnblockRequest,
  fetchHeldRequestsForRequestsStatus,
  rejectTemporaryUnblockRequest,
  unblockAccount,
  unblockProcessRequest,
  reverseHeldItems,
  fetchAccountsForBlockRequest,
  fetchAccountsForUnblockRequest,
} from "./manageAccountsApi";
import {
  BlockAccountDto,
  BlockAccountResponse,
  HeldRequestsStatusFilterParams,
  HeldRequestStatusResponse,
  RequestsStatusFilterParams,
  RequestsStatusListItem,
  RequestsStatusListResponse,
  ReverseHeldItemRequestDto,
  ReverseHeldItemResponse,
  SendRequestProcessParams,
  UnblockAccountDto,
  UnblockAccountResponse,
  UnblockRequestsForProcessItem,
} from "./manageAccountsApi.types";

export function useBlockAccountMutation() {
  return useMutation<BlockAccountResponse, HttpClientError, BlockAccountDto>({
    mutationFn: (values) => blockAccount(values),
  });
}

export function useBlockRequestsStatusListMutation() {
  return useMutation<
    RequestsStatusListResponse,
    HttpClientError,
    RequestsStatusFilterParams
  >({
    mutationFn: (filters) => fetchRequestsForBlockRequestsStatus(filters),
  });
}
export function useUnblockRequestsStatusListMutation() {
  return useMutation<
    RequestsStatusListResponse,
    HttpClientError,
    RequestsStatusFilterParams
  >({
    mutationFn: (filters) => fetchRequestsForUnblockRequestsStatus(filters),
  });
}

export function useBlockProcessRequestMutation() {
  return useMutation<
    boolean,
    HttpClientError,
    { selectedRequestIds: number[]; isForProcess: boolean }
  >({
    mutationFn: ({ selectedRequestIds, isForProcess }) =>
      blockProcessRequest(selectedRequestIds, isForProcess),
  });
}

export function useRejectTemporaryUnblockRequestMutation() {
  return useMutation<
    { numberOfRefusedTemporaryRequests: number },
    HttpClientError,
    { selectedRequestIds: number[] }
  >({
    mutationFn: ({ selectedRequestIds }) =>
      rejectTemporaryUnblockRequest(selectedRequestIds),
  });
}

export function useCancelTemporaryUnblockRequestMutation() {
  return useMutation<
    { numberOfCanceledTemporaryRequests: number },
    HttpClientError,
    { selectedRequestIds: number[] }
  >({
    mutationFn: ({ selectedRequestIds }) =>
      cancelTemporaryUnblockRequest(selectedRequestIds),
  });
}

export function useUnblockAccountMutation() {
  return useMutation<
    UnblockAccountResponse,
    HttpClientError,
    UnblockAccountDto
  >({
    mutationFn: (values) => unblockAccount(values),
  });
}

export function useUnblockProcessRequestMutation() {
  return useMutation<
    boolean,
    HttpClientError,
    { selectedRequestIds: number[]; isForProcess: boolean }
  >({
    mutationFn: ({ selectedRequestIds, isForProcess }) =>
      unblockProcessRequest(selectedRequestIds, isForProcess),
  });
}

export function useReverseHeldItemMutation() {
  return useMutation<
    ReverseHeldItemResponse,
    HttpClientError,
    ReverseHeldItemRequestDto
  >({
    mutationFn: (values) => reverseHeldItems(values),
  });
}

export function useHeldRequestsStatusListMutation() {
  return useMutation<
    HeldRequestStatusResponse,
    HttpClientError,
    HeldRequestsStatusFilterParams
  >({
    mutationFn: (filters) => fetchHeldRequestsForRequestsStatus(filters),
  });
}
export function useAccountsForBlockRequestMutation() {
  return useMutation<
    RequestsStatusListItem[],
    HttpClientError,
    SendRequestProcessParams
  >({
    mutationFn: (filters) => fetchAccountsForBlockRequest(filters),
  });
}
export function useAccountsForUnblockRequestMutation() {
  return useMutation<
    UnblockRequestsForProcessItem[],
    HttpClientError,
    SendRequestProcessParams
  >({
    mutationFn: (filters) => fetchAccountsForUnblockRequest(filters),
  });
}
