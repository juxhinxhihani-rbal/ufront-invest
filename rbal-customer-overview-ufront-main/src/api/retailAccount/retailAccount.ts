import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import { RetailAccountFormValues } from "~/modules/CreateRetailAccount/types";

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
  CreateRetailAccountV2Response,
  OutStandingBalance,
  RetailAccountNumberListDto,
} from "./retailAccount.types";
import { toCreateRetailAccountRequestDto } from "./utils";

export function fetchAccountProducts(
  customerSegmentId: number,
  newAccount = true
): Promise<AccountProductResponse[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Products?type=Account&customerSegmentId=${customerSegmentId}&newCustomer=${newAccount}`
  ).then(jsonErrorHandler());
}

export function fetchAccountCurrency(
  productId: string,
  customerSegmentId: number
): Promise<AccountCurrencyResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Products/${productId}?customerSegmentId=${customerSegmentId}`
  ).then(jsonErrorHandler());
}

export function createRetailAccount(
  customerId: string,
  values: RetailAccountFormValues,
  idempotencyKey: string
): Promise<CreateRetailAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Accounts/creation-request`,
    {
      method: "POST",
      body: JSON.stringify(toCreateRetailAccountRequestDto(values, customerId)),
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function createRetailAccountV2(
  customerId: string,
  values: RetailAccountFormValues,
  idempotencyKey: string
): Promise<CreateRetailAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/v2/retailCustomer/Accounts/creation-request`,
    {
      method: "POST",
      body: JSON.stringify(toCreateRetailAccountRequestDto(values, customerId)),
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
    },
    { timeoutMs: 60000 }
  )
    .then(jsonErrorHandler())
    .then((response) => (response as CreateRetailAccountV2Response).account);
}

export function fetchRetailAccountDetails(
  accountId: number
): Promise<AccountDetailsDto> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customers/accounts/${accountId}`
  ).then(jsonErrorHandler());
}

export function fetchRetailAccountNumberList(
  idParty?: number
): Promise<RetailAccountNumberListDto[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${idParty}/GetRetailAccount`
  ).then(jsonErrorHandler());
}

export function updateAccount(
  values: AccountUpdateDto,
  accountId: number
): Promise<AccountUpdateResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/accounts/${accountId}`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function closeAccount(
  values: AccountCloseDto,
  accountId: number
): Promise<AccountCloseResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/accounts/${accountId}/close`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function activateAccount(
  accountId: number
): Promise<AccountActivateResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/accounts/${accountId}/activate`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function fetchOutstandingBalance(
  accountId: number
): Promise<OutStandingBalance> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customers/accounts/${accountId}/outstanding-balance`
  ).then(jsonErrorHandler());
}

export function uploadFiles(
  customerId: string,
  request: { formData: FormData; documentType?: number }
): Promise<Response> {
  const { formData, documentType } = request;

  const idDocumentTypeParam = documentType
    ? `?idDocumentType=${documentType}`
    : "";

  return advisedFetch(
    `/api/customer-overview/customers/${customerId}/customer-documents${idDocumentTypeParam}`,
    {
      method: "POST",
      body: formData,
    },
    { timeoutMs: undefined }
  ).catch(jsonErrorHandler());
}

export const mapFormToAccountUpdateDto = (
  values: AccountDetailsDto,
  isAccountClosing: boolean
): AccountUpdateDto => {
  return {
    maintenanceCommission: values?.accountCommissions?.maintainance,
    minimumBalance: values?.accountCommissions?.minimumBalance,
    accountToPostInteres: values.accountCommissions.accountToPostInterest,
    removeAlternativeAccountChecked: Boolean(
      values.accountCommissions.accountToPostInterest
    ),
    closingCommission: values.accountCommissions?.closeCommission,
    chargeCalculationTypeSubTypeId: 1,
    abcFlag: values.abcFlag,
    isAmendForCLose: isAccountClosing,
    closureComment: values.closingReasonDetail,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    closureReasonId: values.accountClosureReasons.reasonId,
  };
};

export const mapFormToAccountCloseDto = (
  values: AccountDetailsDto,
  customerId: number
): AccountCloseDto => {
  return {
    customerId: customerId,
    maintenanceCommission: values?.accountCommissions?.maintainance,
    minimumBalance: values?.accountCommissions?.minimumBalance,
    accountToPostInteres: values.accountCommissions.accountToPostInterest,
    removeAlternativeAccountChecked: Boolean(
      values.accountCommissions.accountToPostInterest
    ),
    closingCommission: values.accountCommissions?.closeCommission,
    chargeCalculationTypeSubTypeId: 1,
    abcFlag: values.abcFlag,
  };
};

export const mapAccountDetailsToForm = (
  data: AccountDetailsDto
): AccountDetailsDto => {
  return {
    customerDetails: {
      name: data.customerDetails?.name ?? "",
      surname: data.customerDetails?.surname ?? "",
      fatherName: data.customerDetails?.fatherName ?? "",
      customerNumber: data.customerDetails?.customerNumber ?? "",
      mainSegment: data.customerDetails?.mainSegment ?? "",
      customerSegment: data.customerDetails?.customerSegment ?? "",
    },
    accountCommissions: {
      maintainance: data.accountCommissions?.maintainance ?? 0,
      minimumBalance: data.accountCommissions?.minimumBalance ?? 0,
      closeCommission: data.accountCommissions?.closeCommission ?? 0,
      accountToPostInterest:
        data.accountCommissions?.accountToPostInterest?.trim() ?? "",
    },
    accountParametrizations: {
      interesType: data.accountParametrizations?.interesType ?? "",
      interesTypeId: data.accountParametrizations?.interesTypeId ?? undefined,
      creditType: data.accountParametrizations?.creditType ?? "",
      creditTypeId: data.accountParametrizations?.creditTypeId ?? undefined,
      debitType: data.accountParametrizations?.debitType ?? "",
      debitTypeId: data.accountParametrizations?.debitTypeId ?? undefined,
    },
    accountStatus: {
      statusId: data.accountStatus?.statusId ?? undefined,
      status: data.accountStatus?.status ?? "",
      description: data.accountStatus?.description ?? "",
      color: data.accountStatus?.color ?? "",
    },
    accountNumber: data.accountNumber?.trim() ?? "",
    retailAccountNumber: data.retailAccountNumber?.trim() ?? "",
    iban: data.iban?.trim() ?? "",
    accountCode: data.accountCode?.trim() ?? "",
    accountSequence: data.accountSequence?.trim() ?? "",
    accountStatementFrequency: data.accountStatementFrequency ?? "",
    accountName: data.accountName ?? "",
    currency: data.currency ?? "",
    isActive: data.isActive ?? true,
    abcFlag: data.abcFlag ?? false,
    notificaitonBySmsEnabled: data.notificaitonBySmsEnabled ?? false,
    notificationByMailEnabled: data.notificationByMailEnabled ?? false,
    accountClosureReasons: {
      reasonId: data.accountClosureReasons?.reasonId ?? undefined,
      reasonName: data.accountClosureReasons?.reasonName ?? "",
    },
    closingReasonDetail: data.closingReasonDetail ?? "",
    actions: data.actions ?? [],
    documentToPrint: data.documentToPrint ?? "",
    isActiveInMidas: data.isActiveInMidas ?? false,
  };
};
