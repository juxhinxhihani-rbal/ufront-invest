import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  BranchResponse,
  CustomerSegmentResponse,
  DocumentCategoryTypeResponse,
  DocumentTypeResponse,
  PrefixItemResponse,
  StatusResponse,
  TaxSourceResponse,
  UserResponse,
  AccountClosingResponse,
} from "~/features/dictionaries/dictionariesQueries";
import { toTaxSourceItem } from "./dictionariesDto";
import {
  ChoosingReasonDto,
  CustomerRiskClassificationDto,
  EducationDto,
  InstitutionDto,
  MinistryDto,
  NaceCodeDto,
  PlanProductDto,
  ProfessionDto,
  RiskRatingDto,
  TaxSourceItem,
  MultiSelectDto,
  CustomerSegmentEventData,
  AdressedToDto,
  TypesOfCertificatesDto,
  ActionTypeItem,
} from "./dictionariesApi.types";
import {
  actionTypeMapper,
  addressedToMapper,
  choosingReasonsMapper,
  countriesMapper,
  customerMapDataFromCustomerSegmentSelection,
  customerRiskClassificationsMapper,
  educationLevelsMapper,
  institutionsMapper,
  ministriesMapper,
  multiSelectMapper,
  naceCodesMapper,
  planProductsMapper,
  professionsMapper,
  riskRatingMapper,
  statementAuthorizedPersonsMapper,
  typesOfCertificatesMapper,
} from "./dictionariesMappers";

export function fetchPhonePrefix(): Promise<PrefixItemResponse[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Countries/prefixes`
  ).then(jsonErrorHandler());
}

export function fetchDocumentCategoryType(): Promise<
  DocumentCategoryTypeResponse[]
> {
  return advisedFetch(`/api/customer-overview/customers/categoryType`).then(
    jsonErrorHandler()
  );
}

export function fetchDocumentType(
  categoryType?: number,
  customerSegment?: number
): Promise<DocumentTypeResponse[]> {
  return advisedFetch(
    `/api/customer-overview/customers/document-types?categoryDocTypeId=${categoryType}&idCustomerSegment=${
      customerSegment ?? null
    }`
  ).then(jsonErrorHandler());
}

export function fetchCountries(): Promise<{ id: number; name: string }[]> {
  return advisedFetch("/api/customer-overview/retailCustomer/Countries")
    .then(jsonErrorHandler())
    .then((data) => countriesMapper(data as { name: string; id: number }[]));
}

export function fetchCities(
  countryName?: string
): Promise<{ id: number; name: string }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Countries/${countryName}/cities`
  ).then(jsonErrorHandler());
}

export function fetchAccountOfficers(
  customerSegmentId?: number
): Promise<{ id: number; name: string }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/accountOfficers?customerSegmentId=${customerSegmentId}`
  ).then(jsonErrorHandler());
}

export function fetchSegmentCriterias(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/premium/segmentCriterias`
  ).then(jsonErrorHandler());
}

export function fetchServices(): Promise<{ id: number; name: string }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/premium/services`
  ).then(jsonErrorHandler());
}

export function fetchCustomerServices(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customer/services`
  ).then(jsonErrorHandler());
}
export function fetchGenders(): Promise<{ id: number; name: string }[]> {
  return advisedFetch(`/api/customer-overview/retailCustomer/genders`).then(
    jsonErrorHandler()
  );
}

export function fetchMaritalStatuses(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/maritalStatuses`
  ).then(jsonErrorHandler());
}

export function fetchCustomerDocumentType(
  customerSegmentId?: number
): Promise<{ id: number; name: string }[]> {
  const queryParam = new URLSearchParams();
  if (customerSegmentId) {
    queryParam.append("customerSegmentId", customerSegmentId.toString());
  }
  return advisedFetch(
    `/api/customer-overview/retailCustomer/documentTypes?${queryParam.toString()}`
  ).then(jsonErrorHandler());
}

export function fetchCustomerDocumentIssuer(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/documentTypes/issuers`
  ).then(jsonErrorHandler());
}

export function fetchMainCustomerSegment(): Promise<
  { id: number; parentSegmentId: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customerSegments/main`
  ).then(jsonErrorHandler());
}

export function fetchCustomerSegment(
  parentSegmentId?: number
): Promise<
  { id: number; parentSegmentId: number; name: string; isRetired: boolean }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customerSegments?parentSegmentId=${parentSegmentId}`
  ).then(jsonErrorHandler());
}

export function fetchMainSegments(): Promise<CustomerSegmentResponse[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customerSegments/main`
  ).then(jsonErrorHandler());
}

export function fetchCustomerSegments(
  parentSegmentId: number
): Promise<CustomerSegmentResponse[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/customerSegments?parentSegmentId=${parentSegmentId}`
  ).then(jsonErrorHandler());
}

export function fetchTaxSources(): Promise<TaxSourceItem[]> {
  return advisedFetch(`/api/customer-overview/retailCustomer/crsData`)
    .then(jsonErrorHandler())
    .then((json) => toTaxSourceItem(json as TaxSourceResponse[]));
}

export function fetchProfessions(): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/employment/professions`
  )
    .then(jsonErrorHandler())
    .then((data) => professionsMapper(data as ProfessionDto[]));
}

export function fetchMinistries(): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/employment/ministries`
  )
    .then(jsonErrorHandler())
    .then((data) => ministriesMapper(data as MinistryDto[]));
}

export function fetchInstitutions(
  ministryId?: string
): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/employment/institutions${
      ministryId ? `?ministryId=${ministryId}` : ""
    }`
  )
    .then(jsonErrorHandler())
    .then((data) => institutionsMapper(data as InstitutionDto[]));
}

export function fetchRiskRatings(): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/amlData/riskRatings`
  )
    .then(jsonErrorHandler())
    .then((data) => riskRatingMapper(data as RiskRatingDto[]));
}

export function fetchPlanProducts(): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/amlData/planProducts`
  )
    .then(jsonErrorHandler())
    .then((data) => planProductsMapper(data as PlanProductDto[]));
}

export function fetchDataFromCustomerSegment(
  customerSegmentId: number,
  birthDate?: Date,
  idParty?: number
): Promise<CustomerSegmentEventData> {
  const params = new URLSearchParams({
    customerSegment: customerSegmentId.toString(),
  });

  if (birthDate) {
    params.append("birthDate", birthDate.toISOString());
  }
  if (idParty) {
    params.append("idParty", idParty.toString());
  }

  return advisedFetch(
    `/api/customer-overview/events/customerSegmentChange?${params.toString()}`
  )
    .then(jsonErrorHandler())
    .then((data) =>
      customerMapDataFromCustomerSegmentSelection(
        data as CustomerSegmentEventData
      )
    );
}

export function fetchCustomerRiskClassifications(): Promise<
  { name: string; id: number }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/amlData/customerRiskClassifications`
  )
    .then(jsonErrorHandler())
    .then((data) =>
      customerRiskClassificationsMapper(data as CustomerRiskClassificationDto[])
    );
}

export function fetchChoosingReasons(): Promise<
  { name: string; id: number }[]
> {
  return advisedFetch(`/api/customer-overview/retailCustomer/Reasons/choosing`)
    .then(jsonErrorHandler())
    .then((data) => choosingReasonsMapper(data as ChoosingReasonDto[]));
}

export function fetchAccountClosingReasons(): Promise<
  AccountClosingResponse[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/reasons/account-closing`
  ).then(jsonErrorHandler());
}

export function fetchNaceCodes(): Promise<{ name: string; id: number }[]> {
  return advisedFetch(`/api/customer-overview/retailCustomer/amlData/naceCodes`)
    .then(jsonErrorHandler())
    .then((data) => naceCodesMapper(data as NaceCodeDto[]));
}

export function fetchEducationLevels(): Promise<
  { name: string; id: number }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/amlData/educationLevels`
  )
    .then(jsonErrorHandler())
    .then((data) => educationLevelsMapper(data as EducationDto[]));
}

export function fetchDiligenceEmployTypes(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/diligenceEmployTypes`
  ).then(jsonErrorHandler());
}

export function fetchSourceFundsTypes(): Promise<
  { value: number; label: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/aml/sourceFunds`
  )
    .then(jsonErrorHandler())
    .then((data) => multiSelectMapper(data as MultiSelectDto[]));
}

export function fetchDiligenceBandTypes(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/diligenceBandTypes`
  ).then(jsonErrorHandler());
}

export function fetchTransactionCurrencyTypes(): Promise<
  { value: number; label: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/transactionCurrencyTypes`
  )
    .then(jsonErrorHandler())
    .then((data) => multiSelectMapper(data as MultiSelectDto[]));
}

export function fetchFrequencyTypes(): Promise<{ id: number; name: string }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/diligence/frequencyTypes`
  ).then(jsonErrorHandler());
}

export function fetchPurposeOfBankRelationTypes(): Promise<
  { value: number; label: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/diligence/purposeOfBankRelationTypes`
  )
    .then(jsonErrorHandler())
    .then((data) => multiSelectMapper(data as MultiSelectDto[]));
}

export function fetchFatcaStatusTypes(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/fatcaTypes/statusTypes`
  ).then(jsonErrorHandler());
}

export function fetchFatcaDocumentTypes(): Promise<
  { id: number; name: string }[]
> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/dictionaries/fatcaTypes/documentTypes`
  ).then(jsonErrorHandler());
}

export function fetchBranches(): Promise<BranchResponse[]> {
  return advisedFetch(`/api/customer-overview/branches`).then(
    jsonErrorHandler()
  );
}

export function fetchCurrentBranch(): Promise<BranchResponse> {
  return advisedFetch(`/api/customer-overview/branches/current`).then(
    jsonErrorHandler()
  );
}

export function fetchUsers(branchId?: number): Promise<UserResponse[]> {
  const queryParam = new URLSearchParams();
  if (branchId) {
    queryParam.append("branchId", branchId.toString());
  }
  return advisedFetch(
    `/api/customer-overview/users?${queryParam.toString()}`
  ).then(jsonErrorHandler());
}

export function fetchStatuses(): Promise<StatusResponse[]> {
  return advisedFetch(
    "/api/customer-overview/authorization/changes/authorize-statuses"
  ).then(jsonErrorHandler());
}

export function fetchCurrentUser(): Promise<UserResponse> {
  return advisedFetch(`/api/customer-overview/users/current`).then(
    jsonErrorHandler()
  );
}

export function fetchCurrentUserRole(): Promise<string> {
  return advisedFetch(`/api/customer-overview/users/role-description`).then(
    (response) => response.text()
  );
}

export function fetchTypesOfCertificates(): Promise<
  { name: string; id: number }[]
> {
  return advisedFetch(`/api/customer-overview/bankStatements/typesOfCerticates`)
    .then(jsonErrorHandler())
    .then((data) =>
      typesOfCertificatesMapper(data as TypesOfCertificatesDto[])
    );
}

export function fetchAddressedToTypes(): Promise<
  { name: string; id: number }[]
> {
  return advisedFetch(`/api/customer-overview/bankStatements/addressesToList`)
    .then(jsonErrorHandler())
    .then((data) => addressedToMapper(data as AdressedToDto[]));
}

export function fetchStatementAuthorizedPersons(
  customerId: number,
  productId: number
): Promise<{ id: number; name: string }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/Customers/${customerId}/authorized-persons/accounts/${productId}`
  )
    .then(jsonErrorHandler())
    .then((data) =>
      statementAuthorizedPersonsMapper(
        data as { idParty: number; reportName: string }[]
      )
    );
}

export function fetchActionTypes(
  actionType: string
): Promise<{ name: string; id: number }[]> {
  return advisedFetch(
    `/api/customer-overview/retailCustomer/ManageAccounts/action-type?actionType=${actionType}`
  )
    .then(jsonErrorHandler())
    .then((json) => actionTypeMapper(json as ActionTypeItem[]));
}
