import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";
import {
  AccountForInputRequest,
  BlockAccountDto,
  BlockAccountResponse,
  HeldRequestsStatusFilterParams,
  HeldRequestStatusResponse,
  RequestsStatusFilterParams,
  RequestsStatusListItem,
  RequestsStatusListResponse,
  SendRequestProcessParams,
  TemporaryUnblockRequestItem,
  UnblockAccountDto,
  UnblockAccountResponse,
  ReverseHeldItemsList,
  ReverseHeldItemRequestDto,
  ReverseHeldItemResponse,
  UnblockRequestsForProcessItem,
} from "./manageAccountsApi.types";

export function fetchAccountsForInputRequest(
  customerId?: string
): Promise<AccountForInputRequest[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/ManageAccounts`
  ).then(jsonErrorHandler());
}

export function blockAccount(
  values: BlockAccountDto
): Promise<BlockAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/block`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchRequestsForBlockRequestsStatus(
  filters: RequestsStatusFilterParams
): Promise<RequestsStatusListResponse> {
  const params = new URLSearchParams({
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  if (filters.pageNumber) {
    params.append("pageNumber", filters.pageNumber.toString());
  }
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/block/requests-status?${params.toString()}`
  ).then(jsonErrorHandler());
}
export function fetchRequestsForUnblockRequestsStatus(
  filters: RequestsStatusFilterParams
): Promise<RequestsStatusListResponse> {
  const params = new URLSearchParams({
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  if (filters.pageNumber) {
    params.append("pageNumber", filters.pageNumber.toString());
  }
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock/requests-status?${params.toString()}`
  ).then(jsonErrorHandler());
}

export function fetchAccountsForBlockRequest(
  filters?: SendRequestProcessParams
): Promise<RequestsStatusListItem[]> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/block?${params.toString()}`
  ).then(jsonErrorHandler());
}

export function blockProcessRequest(
  selectedRequestIds: number[],
  isForProcess: boolean
): Promise<boolean> {
  const params = new URLSearchParams({
    isForProcess: isForProcess.toString(),
  });
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/block/process-or-cancel?${params.toString()}`,
    {
      method: "POST",
      body: JSON.stringify(selectedRequestIds),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function unblockAccount(
  values: UnblockAccountDto
): Promise<UnblockAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchAccountsForTemporaryUnblockRequest(): Promise<
  TemporaryUnblockRequestItem[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock/temporary-requests`
  ).then(jsonErrorHandler());
}

export function rejectTemporaryUnblockRequest(
  selectedRequestIds: number[]
): Promise<{ numberOfRefusedTemporaryRequests: number }> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock-temporary/refuse`,
    {
      method: "PUT",
      body: JSON.stringify(selectedRequestIds),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function cancelTemporaryUnblockRequest(
  selectedRequestIds: number[]
): Promise<{ numberOfCanceledTemporaryRequests: number }> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock-temporary/cancel`,
    {
      method: "PUT",
      body: JSON.stringify(selectedRequestIds),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchAccountsForUnblockRequest(
  filters?: SendRequestProcessParams
): Promise<UnblockRequestsForProcessItem[]> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock?${params.toString()}`
  ).then(jsonErrorHandler());
}

export function unblockProcessRequest(
  selectedRequestIds: number[],
  isForProcess: boolean
): Promise<boolean> {
  const params = new URLSearchParams({
    isForProcess: isForProcess.toString(),
  });
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/unblock/process-or-cancel?${params.toString()}`,
    {
      method: "POST",
      body: JSON.stringify(selectedRequestIds),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchRequestsForReverseHeldItem(
  params: ListCustomersParams
): Promise<ReverseHeldItemsList[]> {
  const queryParams = toListCustomersQueryParams(params);

  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/held?${queryParams.toString()}`
  ).then(jsonErrorHandler());
}

function toListCustomersQueryParams(params: ListCustomersParams) {
  const searchParams = new URLSearchParams();

  if (params.fullNameContains) {
    searchParams.append("description", params.fullNameContains);
  }
  if (params.customerNo) {
    searchParams.append("customerNumber", params.customerNo);
  }
  if (params.retailAccountNo) {
    searchParams.append("retailAccountNumber", params.retailAccountNo);
  }

  return searchParams;
}

export function reverseHeldItems(
  values: ReverseHeldItemRequestDto
): Promise<ReverseHeldItemResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/held/reverse`,
    {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchHeldRequestsForRequestsStatus(
  filters: HeldRequestsStatusFilterParams
): Promise<HeldRequestStatusResponse> {
  const params = new URLSearchParams({
    shouldCheckAllRoles: "true",
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  if (filters.pageNumber) {
    params.append("pageNumber", filters.pageNumber.toString());
  }
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/held/requests-status?${params.toString()}`
  ).then(jsonErrorHandler());
}
