import {
  AccountRightsDto,
  CustomerAuthorizedPersonsResponse,
  CustomerStatusCode,
} from "../customer/customerApi.types";

export interface AccountProductResponse {
  id: number;
  name: string;
}

export interface CurrencyItem {
  currencyId: number;
  currencyCode: string;
}

export interface AccountCurrencyResponse {
  currencies: CurrencyItem[];
}

export interface CreateRetailAccountRequest {
  productId: number | null;
  currencyCode: string | null;
  accountName: string | null;
}

export interface CreateRetailAccountResponse {
  accountNumber: string;
  retailAccountNumber: string;
  iban: string;
  accountName: string;
  currencyCode: string;
  accountProductName: string;
  customerStatusId?: CustomerStatusCode;
  premiumData?: PremiumDataResponseDto;
}

export interface CreateRetailAccountV2Response {
  productId: number;
  status: string;
  account: CreateRetailAccountResponse;
}

export interface AccountDetailsDto {
  customerDetails: CustomerDetails;
  accountCommissions: AccountCommissions;
  accountParametrizations: AccountParametrizations;
  accountStatus: AccountStatusDto;
  accountNumber: string;
  retailAccountNumber: string;
  iban: string;
  accountCode: string;
  accountSequence: string;
  accountStatementFrequency: string;
  accountName: string;
  currency: string;
  isActive: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  abcFlag: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  notificaitonBySmsEnabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  notificationByMailEnabled?: boolean;
  accountClosureReasons: AccountClosureReasons;
  closingReasonDetail: string;
  actions: string[];
  documentToPrint: string;
  isActiveInMidas: boolean;
}

export interface CustomerDetails {
  name?: string;
  surname?: string;
  fatherName?: string;
  customerNumber?: string;
  mainSegment?: string;
  customerSegment?: string;
}

export interface AccountStatusDto {
  statusId?: number;
  status?: string;
  description?: string;
  color?: string;
}
export interface AccountCommissions {
  maintainance: number;
  minimumBalance: number;
  closeCommission: number;
  accountToPostInterest: string;
}

export interface AccountClosureReasons {
  reasonId?: number;
  reasonName?: string;
}

export interface AccountParametrizations {
  interesType?: string;
  interesTypeId?: number;
  creditType?: string;
  creditTypeId?: number;
  debitType?: string;
  debitTypeId?: number;
}

export interface AccountUpdateDto {
  maintenanceCommission: number;
  minimumBalance: number;
  closingCommission: number;
  accountToPostInteres?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  removeAlternativeAccountChecked: boolean;
  chargeCalculationTypeSubTypeId: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  abcFlag: boolean;
  isAmendForCLose: boolean;
  closureComment: string;
  closureReasonId?: number;
}

export interface AccountCloseDto {
  customerId: number;
  maintenanceCommission: number;
  minimumBalance: number;
  closingCommission: number;
  accountToPostInteres?: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  removeAlternativeAccountChecked: boolean;
  chargeCalculationTypeSubTypeId: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  abcFlag: boolean;
}

export interface AccountUpdateResponse {
  accountUpdateStatus: string;
  isOk: boolean;
}

export interface AccountCloseResponse {
  messages: AccountClosureCode[];
  isSendForAuthorization: boolean;
  retailAccountActions: AccountResponseMessage[];
}

export interface AccountActivateResponse {
  message: ActivationAccountCode;
  isSendForActivation: boolean;
}

export interface AccountResponseMessage {
  product: string;
  value: string;
  message: string;
}

export enum ActivationAccountCode {
  SendForActivation = "SendForActivation",
}

export enum AccountClosureCode {
  AccountConnectedWithSafeBox = "Llogaria është e lidhur me një Safe Box, nuk mund të mbyllet",
  AccountConnectedWithDebitCard = "Llogaria është ende e lidhur me një kartë debiti në Centaur;",
  AccountWithBalance = "Llogaria është me gjëndje",
  MissingCustomerSelfCertification = "Klientit i mungon 'Self Certification'",
  AccountSentForAuthorization = "Llogaria u dërgua per autorizim",
  AccountSimbaValidation = "Dështoi validimi i Produkteve aktive në Simba!",
  AccountHasActions = "AccountHasActions",
  AccountCustodyValidation = "Llogaria është e lidhur me investime në tregje kapitale",
}

export enum AccountDocumentType {
  AccountClosure = "AccountClosure",
  AccountClosureBasic = "AccountClosureBasic",
  AccountClosureSocial = "AccountClosureSocial",
  AccountDetails = "AccountDetails",
}

export enum AccountAction {
  AmendAccount = "account.amendDetails",
  AmendForCloseAccount = "account.amendForClose",
  CloseAccount = "account.close",
  ActivateAccount = "account.activate",
}

export interface OutStandingBalance {
  outstandingBalance?: number;
  accountId?: number;
}
export interface CreateRetailAccountRequestDto {
  customerId: number;
  productId: number;
  parameters: {
    currencyCode: string;
    accountName: string;
    accountStatementFrequency?: string;
  };
}

export interface ResegmentationStatusResponse {
  additionalDataErrorFields: string[];
  isAdditionalDataRequired: boolean;
  isChargeAccountSelectionNeeded: boolean;
  isPremiumDataRequired: true;
  requiredFields: string[];
  shouldNotifyCardChanged: boolean;
}

export interface AuthorizedPersonDto {
  selectedAuthorizedPerson: CustomerAuthorizedPersonsResponse;
  accounts: AccountRightsDto;
}

export interface RetailAccountNumberListDto {
  productId: number;
  retailAccountNumber: string;
  accountNumber: string;
  openDate: string;
}

export interface PremiumDataResponseDto {
  accountOfficerId: number | undefined;
  segmentCriteriaId: number | undefined;
  premiumServiceId: number | undefined;
}
