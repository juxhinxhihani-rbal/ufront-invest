import {
  jsonErrorHandler,
  advisedFetch,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  DefaultAccountAuthorizationFiltersParams,
  DefaultAccountRightsAuthorizationFiltersParams,
  DefaultAmlAuthorizationFiltersParams,
  DefaultCrsAuthorizationFiltersParams,
  DefaultCustomerAuthorizationFiltersParams,
  DefaultDigitalAuthorizationFiltersParams,
  DefaultSpecimenAuthorizationFiltersParams,
} from "~/modules/Authorization/types";
import { ListCustomersParams } from "~/modules/CustomerListingPage/types";
import { SpecimenDetailsDto } from "../authorization/authorizationApi.types";
import {
  CreateRetailAccountResponse,
  ResegmentationStatusResponse,
} from "../retailAccount/retailAccount.types";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDocumentListResponse,
  CustomerUpdateDto,
  CustomerListingItem,
  CustomerListingResponse,
  ReadAccountBalancesResponse,
  CustomerDto,
  CustomerResegmentationProcessDto,
  CustomerRetailAccount,
  AccountRightsDto,
  AccountRightsInfo,
  CustomerType,
  AccountRightsModel,
  AccountRightUpdateDto,
  SignatureStatusCode,
  CreateCustomerDto,
  CreateCustomerResponse,
  CustomerStatusDto,
  ExistingCustomerRequest,
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
  SendCustomerDocumentResponse,
  GetCustomerDocumentDto,
  FshuContractDto,
  UnformattedCustomerAuthorizedPersonsResponse,
} from "./customerApi.types";
import {
  mapAuthorizedPersonsDto,
  toAuthorizedPersonRights,
  toCustomerItem,
  toCustomerListingItem,
} from "./customerDto";

export function fetchCustomersListing(
  params: ListCustomersParams,
  isForWalkInSearch?: boolean
): Promise<CustomerListingItem[]> {
  const queryParams = toListCustomersQueryParams(params);
  if (isForWalkInSearch) {
    queryParams.append("isForWalkInSearch", isForWalkInSearch.toString());
  }

  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customer/SearchCustomer?${queryParams.toString()}`
  )
    .then(jsonErrorHandler<CustomerListingResponse[]>())
    .then((json) => toCustomerListingItem(json));
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

export function fetchCustomer(customerId: string): Promise<CustomerDto> {
  return fetch(`/api/customer-overview/retailCustomer/Customers/${customerId}`)
    .then(jsonErrorHandler<CustomerDto>())
    .then((json) => toCustomerItem(json));
}

export function fetchCustomerRetailAccounts(
  customerId?: number
): Promise<CustomerRetailAccount[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/Accounts`
  ).then(jsonErrorHandler());
}

export function fetchCustomerChargeableRetailAccounts(
  customerId?: number,
  segmentId?: number
): Promise<CustomerRetailAccount[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/Accounts/chargeable${
      segmentId ? `?segmentId=${segmentId}` : ``
    }`
  ).then(jsonErrorHandler());
}

export function fetchCustomerRetailAccountsAuthorizedByPerson(
  customerId?: number,
  authorizedPersonId?: number
): Promise<CustomerRetailAccount[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonId}/accounts`
  ).then(jsonErrorHandler());
}

export function fetchCustomerAvailableForAuthorizationRetailAccounts(
  customerId?: number,
  otherPersonId?: number
): Promise<CustomerRetailAccount[]> {
  const queryParams = toAvailableRetailAccountQueryParams(otherPersonId);

  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/Accounts/authorizable?${queryParams.toString()}`
  ).then(jsonErrorHandler());
}

function toAvailableRetailAccountQueryParams(otherPersonId?: number) {
  const searchParams = new URLSearchParams();

  if (otherPersonId) {
    searchParams.append("otherPersonIdParty", otherPersonId.toString());
  }

  return searchParams;
}

export function updateCustomerChargeAccount(
  productId: number,
  customerId?: string
): Promise<UpdateCustomerChargeAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/Accounts/${productId}/charge-account`,
    {
      method: "PUT",
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler());
}

export function createCustomer(
  values: CreateCustomerDto
): Promise<CreateCustomerResponse> {
  // TODO: implement
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers`,
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

export function createCustomerV2(
  values: CreateCustomerDto
): Promise<CreateCustomerResponse> {
  return advisedFetch(
    `/api/customer-overview/v2/retailCustomer/Customers`,
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

export function updateCustomer(
  values: CustomerUpdateDto,
  isForResegmentation: boolean,
  customerId?: string
): Promise<CreateRetailAccountResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/modification-request${
      `?isForResegmentation=` + isForResegmentation
    }`,
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

export function convertCustomer(
  values: CreateCustomerDto,
  customerId?: string
): Promise<CreateCustomerResponse> {
  // TODO: implement
  return advisedFetch(
    `/api/customer-overview/customer/walkIn/${customerId}`,
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

export function fetchCustomerRetailAccountsBalances(
  customerId: number,
  accountNumbers: string[]
): Promise<ReadAccountBalancesResponse> {
  const queryParams = toFetchBalancesQueryParams(accountNumbers);

  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/account-balances?${queryParams.toString()}`
  ).then(jsonErrorHandler());
}

export function fetchCustomerAuthorizedPersons(
  customerId?: number
): Promise<CustomerAuthorizedPersonsResponse[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons`
  )
    .then(jsonErrorHandler())
    .then((response) =>
      mapAuthorizedPersonsDto(
        response as UnformattedCustomerAuthorizedPersonsResponse[]
      )
    );
}

export function addCustomerAuthorizedPersons(
  customerId?: number,
  authorizedPersonsId?: number
): Promise<undefined> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonsId}`,
    { method: "POST" }
  ).then(jsonErrorHandler());
}

export function fetchAuthorizedRights(
  customerId?: number,
  authorizedPersonsId?: number
): Promise<AccountRightsDto> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonsId}/rights`
  )
    .then(jsonErrorHandler())
    .then((data) => toAuthorizedPersonRights(data as AccountRightsModel));
}

export function updateAuthorizedRights(
  values: AccountRightUpdateDto,
  customerId?: number,
  authorizedPersonsId?: number
): Promise<Response> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonsId}/rights`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then((response: Response) =>
    response.status === 204 ? response : jsonErrorHandler<Response>()(response)
  );
}

export function fetchAllRights(
  type?: CustomerType
): Promise<AccountRightsInfo[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/authorization-rights${
      type && `?type=${type}`
    }`
  ).then(jsonErrorHandler());
}

export function fetchCustomerDocumentList(
  customerId?: number,
  categoryType?: number,
  documentType?: number
): Promise<CustomerDocumentListResponse[]> {
  return advisedFetch(
    `/api/customer-overview/customers/${customerId}/customer-documents/list${
      categoryType ? `?categoryDocTypeId=${categoryType}` : ""
    }${documentType ? `&documentTypeId=${documentType}` : ""}`
  ).then(jsonErrorHandler());
}

export function fetchAvailableCustomerDocuments(
  customerId?: number
): Promise<AvailableCustomerDocument[]> {
  return advisedFetch(
    `/api/customer-overview/customers/${customerId}/customer-documents/available`
  ).then(jsonErrorHandler());
}
export function fetchCustomerDocumentUrl({
  customerId,
  authorizedPersonId,
  retailAccountId,
  documentTemplateCode,
}: GetCustomerDocumentDto & {
  documentTemplateCode?: string;
}): Promise<{
  url: string;
}> {
  const authorizedPersonIdParam = authorizedPersonId
    ? `&authorizedPersonId=${Number(authorizedPersonId)}`
    : "";

  const retailAccountIdParam = retailAccountId
    ? `&retailAccountId=${Number(retailAccountId)}`
    : "";

  return advisedFetch(
    `/api/customer-overview/customers/${Number(
      customerId
    )}/customer-documents/url${
      documentTemplateCode
        ? `?documentTemplateCode=${documentTemplateCode}${authorizedPersonIdParam}${retailAccountIdParam}`
        : ""
    }`
  ).then(jsonErrorHandler());
}

export function fetchCustomerStatus(
  customerId?: string
): Promise<CustomerStatusDto> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/status`
  ).then(jsonErrorHandler());
}

export function toQueryParams(listingParams: ListCustomersParams) {
  const searchParams = new URLSearchParams();
  for (const [param, value] of Object.entries(listingParams)) {
    if (value) {
      searchParams.set(param, value);
    }
  }
  return searchParams;
}

function toFetchBalancesQueryParams(accountNumbers: string[]) {
  const queryParams = new URLSearchParams();

  for (const accountNo of accountNumbers) {
    queryParams.append("retailAccountNumbers", accountNo);
  }
  return queryParams;
}

export function resegmentCustomer(
  values: CustomerResegmentationProcessDto,
  customerId?: string
): Promise<Response> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/resegment-request`,
    {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then((response: Response) =>
    response.status === 204 ? response : jsonErrorHandler<Response>()(response)
  );
}

export function checkResegmentStatus(
  customerId?: number,
  customerSegmentId?: number
): Promise<ResegmentationStatusResponse> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/resegment-validation/${customerSegmentId}`
  ).then(jsonErrorHandler());
}

export function revokeAuthorizedPerson(
  customerId?: string,
  authorizedPersonIdParty?: number
): Promise<Response> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonIdParty}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then((response: Response) =>
    response.status === 204 ? response : jsonErrorHandler<Response>()(response)
  );
}

export function checkAuthorizedPersonStatus(
  customerId?: number,
  authorizedPersonIdParty?: number
): Promise<SignatureStatusCode> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/${authorizedPersonIdParty}/status`
  ).then(jsonErrorHandler());
}

export function checkIfCustomerExists(
  payload: ExistingCustomerRequest,
  mode: string
): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/exists?mode=${mode}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(jsonErrorHandler());
}

export function fetchAuthorizationCustomerList(
  filters: DefaultCustomerAuthorizationFiltersParams
): Promise<AuthorizationCustomersListResponse> {
  const params = new URLSearchParams();
  if (filters.date) {
    params.append("date", filters.date);
  }
  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.userId !== undefined)
    params.append("userId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("branchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());
  if (filters.customerStatusId !== undefined)
    params.append("customerStatusId", filters.customerStatusId.toString());

  return advisedFetch(
    `/api/customer-overview/authorization/changes?${params.toString()}`
  )
    .then(jsonErrorHandler<AuthorizationCustomersListResponse>())
    .then((json) => json);
}

export function fetchAuthorizationSpecimenList(
  filters: DefaultSpecimenAuthorizationFiltersParams
): Promise<AuthorizationSpecimenListResponse> {
  const params = new URLSearchParams();
  if (filters.dateTimeSpecimen)
    params.append("dateTimeSpecimen", filters.dateTimeSpecimen);
  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.idUser !== undefined)
    params.append("idUser", filters.idUser.toString());
  if (filters.idBranch !== undefined)
    params.append("idBranch", filters.idBranch.toString());
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());
  if (filters.signatureStatusId !== undefined)
    params.append("signatureStatusId", filters.signatureStatusId.toString());

  return advisedFetch(
    `/api/customer-overview/specimen-authorization/specimen-changes?${params.toString()}`
  )
    .then(jsonErrorHandler<AuthorizationSpecimenListResponse>())
    .then((json) => json);
}

export function fetchAuthorizationAccountList(
  filters: DefaultAccountAuthorizationFiltersParams
): Promise<AuthorizationAccountListResponse> {
  const params = new URLSearchParams();

  if (filters.date) {
    params.append("date", filters.date);
  }

  if (filters.retailAccountNumber)
    params.append("retailAccountNumber", filters.retailAccountNumber);
  if (filters.userId) params.append("userId", filters.userId.toString());
  if (filters.branchId) params.append("branchId", filters.branchId.toString());
  if (filters.pageNumber)
    params.append("pageNumber", filters.pageNumber.toString());
  if (filters.accountStatusId)
    params.append("accountStatusId", filters.accountStatusId.toString());

  return advisedFetch(
    `/api/customer-overview/authorization/accounts?${params.toString()}`
  )
    .then(jsonErrorHandler<AuthorizationAccountListResponse>())
    .then((json) => json);
}

export function fetchAccountRightsAuthorizationList(
  filters: DefaultAccountRightsAuthorizationFiltersParams
): Promise<AccountRightsAuthorizationListResponse> {
  const params = new URLSearchParams();
  if (filters.dateTimeAccountRights) {
    params.append("dateTimeAccountRights", filters.dateTimeAccountRights);
  }
  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.userId !== undefined)
    params.append("userId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("branchId", filters.branchId.toString());
  if (filters.signatureStatusId !== undefined)
    params.append("signatureStatusId", filters.signatureStatusId.toString());
  if (filters.retailAccountNumber !== undefined)
    params.append(
      "retailAccountNumber",
      filters.retailAccountNumber.toString()
    );
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());

  return advisedFetch(
    `/api/customer-overview/authorization/account-rights?${params.toString()}`
  )
    .then(jsonErrorHandler<AccountRightsAuthorizationListResponse>())
    .then((json) => json);
}

export function fetchDigitalAuthorizationList(
  filters: DefaultDigitalAuthorizationFiltersParams
): Promise<DigitalAuthorizationListResponse> {
  const params = new URLSearchParams();
  if (filters.idUser) {
    params.append("userId", filters.idUser.toString());
  }
  if (filters.dateTimeDigital) {
    params.append("date", filters.dateTimeDigital);
  }
  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());

  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/applicationlist/idbranch/${
      filters.idBranch
    }?${params.toString()}`
  )
    .then(jsonErrorHandler<DigitalAuthorizationListResponse>())
    .then((json) => json);
}

export function fetchAmlAuthorizationList(
  filters: DefaultAmlAuthorizationFiltersParams
): Promise<AmlAuthorizationListResponse> {
  const params = new URLSearchParams();

  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.userId !== undefined)
    params.append("userId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("branchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());

  return advisedFetch(
    `/api/customer-overview/authorization/aml?${params.toString()}`
  )
    .then(jsonErrorHandler<AmlAuthorizationListResponse>())
    .then((json) => json);
}

export function fetchCrsAuthorizationList(
  filters: DefaultCrsAuthorizationFiltersParams
): Promise<CrsAuthorizationListResponse> {
  const params = new URLSearchParams();

  if (filters.customerNumber)
    params.append("customerNumber", filters.customerNumber);
  if (filters.userId !== undefined)
    params.append("userId", filters.userId.toString());
  if (filters.branchId !== undefined)
    params.append("branchId", filters.branchId.toString());
  if (filters.pageNumber !== undefined)
    params.append("pageNumber", filters.pageNumber.toString());

  return advisedFetch(
    `/api/customer-overview/authorization/crs?${params.toString()}`
  )
    .then(jsonErrorHandler<CrsAuthorizationListResponse>())
    .then((json) => json);
}

export function fetchCustomerSpecimen(
  customerId?: string
): Promise<CustomerSpecimenResponse> {
  return advisedFetch(`/api/customer-overview/specimens/${customerId}`).then(
    jsonErrorHandler()
  );
}

export function uploadCustomerSpecimen(
  customerId: string,
  request: { formData: FormData; description?: string }
): Promise<boolean> {
  const { formData, description } = request;

  const params = new URLSearchParams();
  if (customerId) {
    params.append("customerPartyId", customerId);
  }
  if (description) params.append("description", description);

  return advisedFetch(
    `/api/customer-overview/specimens?${params.toString()}`,
    {
      method: "POST",
      body: formData,
    },
    { timeoutMs: undefined }
  ).then(jsonErrorHandler());
}

export function fetchCustomerSpecimenDetails(
  customerId: string
): Promise<SpecimenDetailsDto> {
  return advisedFetch(`/api/customer-overview/specimens/${customerId}`)
    .then(jsonErrorHandler<SpecimenDetailsDto>())
    .then((json) => json);
}

export function fetchDigitalBanking(
  customerId: string
): Promise<DigitalBankingDto> {
  return fetch(
    `/api/customer-overview/retailCustomer/Customers/digitalBanking/application/${customerId}`
  )
    .then(jsonErrorHandler<DigitalBankingDto>())
    .then((json) => json);
}

export function deleteCustomerDocument(
  attachmentId: number,
  fileCorrelationId: string,
  customerId?: string
): Promise<Response> {
  const params = new URLSearchParams({
    attachmentId: attachmentId.toString(),
  });
  if (fileCorrelationId) {
    params.append("fileCorrelationId", fileCorrelationId);
  }
  return advisedFetch(
    `/api/customer-overview/customers/${customerId}/customer-document?${params.toString()}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then((response: Response) =>
    response.status === 204 ? response : jsonErrorHandler<Response>()(response)
  );
}

export function sendCustomerDocumentByMail(
  attachmentId: number
): Promise<SendCustomerDocumentResponse> {
  return advisedFetch(
    `/api/customer-overview/customers/customer-document/${attachmentId}/send-document`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 60000 }
  ).then(jsonErrorHandler<SendCustomerDocumentResponse>());
}

export function fetchCustomerFshuContracts(
  ssn?: string
): Promise<FshuContractDto[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Oshe/customers/${ssn}`
  ).then(jsonErrorHandler());
}
