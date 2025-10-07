export interface AccountForInputRequest {
  customerName: string;
  retailAccountNumber: string;
  currency: string;
  accountCode: string;
  isBlockDebit: boolean;
  isBlockCredit: boolean;
  heldItem: number;
}

export interface BlockAccountDto {
  partyId: string;
  retailAccountNumber: string[];
  blockType: number;
  blockStartDate: string;
  blockEndDate: string;
  blockReason: string;
  shouldNotifyCardUnit: boolean;
  shouldNotifyAmlUnit: boolean;
  executionOrder: string;
}

export interface BlockAccountResponse {
  message: string;
  isSuccess: boolean;
}
export interface SendRequestProcessParams {
  startDate: string;
  endDate: string;
}

export interface RequestsStatusFilterParams {
  startDate: string;
  endDate: string;
  pageNumber?: number | undefined;
}

export interface RequestsStatusListResponse {
  response: RequestsStatusListItem[];
  totalPageNumber: number;
}

export interface RequestsStatusListItem {
  customerNumber: string;
  retailAccountNumber: string;
  currencyCode: string;
  accountCode: string;
  blockType?: string;
  unblockType?: string;
  blockAuthority?: string;
  unblockAuthority?: string;
  blockingReason?: string;
  unblockingReason?: string;
  blockStartDate?: string;
  blockEndDate?: string;
  shouldNotifyCardUnit: boolean;
  shouldNotifyAmlUnit: boolean;
  executionOrder: string;
  requestStatus: string;
  userRequested: string;
  dateTimeInserted: string;
  dateTimeBranchAuthorized: string;
  idRequest: number;
}

export interface TemporaryUnblockRequestItem {
  idAction: number;
  idRequest: number;
  nrp: string;
  retailAccountNumber: string;
  currencyCode: string;
  accountCode: string;
  blockType: string;
  blockAuthority: string;
  blockingReason: string;
  blockStartDate: string;
  blockEndDate: string;
  shouldNotifyCardUnit: boolean;
  shouldNotifyAmlUnit: boolean;
  executionOrder: string;
  userRequested: string;
  userReq: string;
  unblockDescription: string;
  unblockAuthority: string;
  isTemporary: boolean;
}
export interface UnblockAccountDto {
  partyId: string;
  retailAccountNumber: string[];
  unblockType: number;
  unblockReason: string;
  shouldNotifyCardUnit: boolean;
  shouldNotifyAmlUnit: boolean;
  executionOrder: string;
}

export interface UnblockAccountResponse {
  message: string;
  isSuccess: boolean;
  successfulAccounts: string[];
  failedAccounts: string[];
}

export interface UnblockForProcessResponse {
  response: UnblockRequestsForProcessItem[];
}

export interface UnblockRequestsForProcessItem {
  customerName: string;
  customerNumber: string;
  retailAccountNumber: string;
  currencyCode: string;
  accountCode: string;
  blockType: string;
  unblockAuthority: string;
  unblockDescription: string;
  shouldNotifyCardUnit: boolean;
  shouldNotifyAmlUnit: boolean;
  executionOrder: string;
  requestStatus: string;
  userRequested: string;
  dateTimeInserted: string;
  dateTimeBranchAuthorized: string;
  idRequest: number;
}

export interface ReverseHeldItemsList {
  requestId: number;
  customerNumber: string;
  customerName: string;
  retailAccountNumber: string;
  currencyCode: string;
  accountCode: string;
  heldType: string;
  actionType: string;
  creditor: string;
  heldAuthority: string;
  heldReason: string;
  heldAmount: number;
  heldAmountUserInput: number;
  currencyOrder: string;
  heldStartDate: string;
  heldEndDate: string;
  shouldNotifyCardUnit: boolean;
  amNotificationUnitEmail: string;
  requestStatus: string;
  userRequested: string;
  dateTimeInput: string;
  heldItemReference: string;
  comment: string;
}

export interface ReverseHeldItemRequestDto {
  heldItemRequestsForReverse: HeldItemRequestsForReverse[];
  shouldNotifyCardUnit: boolean;
  isTemporary: boolean;
  description: string;
}

export interface HeldItemRequestsForReverse {
  idRequest: number;
  currencyCode: string;
  accountCode: string;
  customerName: string;
  customerNumber: string;
  retailAccountNumber: string;
}

export interface ReverseHeldItemResponse {
  message: string;
  isSuccess: boolean;
}

export interface HeldRequestStatusListItem {
  requestId?: number;
  customerNumber?: string;
  retailAccountNumber?: string;
  heldAmount?: number;
  currencyCode?: string;
  heldAmountUserInput?: number;
  inputCurrencyCode?: string;
  accountCode?: string;
  heldType?: string;
  requesterAuthority?: string;
  heldReason?: string;
  heldStartDate?: string;
  heldEndDate?: string;
  shouldNotifyCardUnit?: boolean;
  shouldNotifyAmlUnit?: string;
  requestStatus?: string;
  midasMessage?: string;
  comment?: string;
  userRequested?: string;
  branchId: number;
  dateTimeInput?: string;
  dateTimeAmend?: string;
  refAmendId?: number;
  refReverseId?: number;
  heldItemReference?: string;
}

export interface HeldRequestStatusResponse {
  response: HeldRequestStatusListItem[];
  totalPageNumber: number;
}

export interface HeldRequestsStatusFilterParams {
  startDate: string;
  endDate: string;
  pageNumber?: number | undefined;
}
