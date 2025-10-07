import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { useQuery } from "react-query";
import {
  fetchAccountOfficers,
  fetchCities,
  fetchCountries,
  fetchCustomerDocumentIssuer,
  fetchCustomerDocumentType,
  fetchDocumentCategoryType,
  fetchDocumentType,
  fetchGenders,
  fetchMaritalStatuses,
  fetchPhonePrefix,
  fetchSegmentCriterias,
  fetchServices,
  fetchCustomerServices,
  fetchMainCustomerSegment,
  fetchCustomerSegment,
  fetchTaxSources,
  fetchProfessions,
  fetchMinistries,
  fetchInstitutions,
  fetchRiskRatings,
  fetchPlanProducts,
  fetchCustomerRiskClassifications,
  fetchChoosingReasons,
  fetchNaceCodes,
  fetchEducationLevels,
  fetchDiligenceEmployTypes,
  fetchSourceFundsTypes,
  fetchDiligenceBandTypes,
  fetchTransactionCurrencyTypes,
  fetchFrequencyTypes,
  fetchPurposeOfBankRelationTypes,
  fetchFatcaStatusTypes,
  fetchFatcaDocumentTypes,
  fetchDataFromCustomerSegment,
  fetchBranches,
  fetchUsers,
  fetchStatuses,
  fetchCurrentBranch,
  fetchCurrentUser,
  fetchAccountClosingReasons,
  fetchAddressedToTypes,
  fetchTypesOfCertificates,
  fetchStatementAuthorizedPersons,
  fetchActionTypes,
  fetchCurrentUserRole,
} from "~/api/dictionaries/dictionariesApi";
import { CustomerSegmentEventData } from "~/api/dictionaries/dictionariesApi.types";
import { CacheExpiration } from "~/api/enums/CacheExpiration";

export interface PrefixItemResponse {
  countryCode: string;
  prefixes: string[];
}

export interface DocumentCategoryTypeResponse {
  categoryId: number;
  categories: string;
}

export interface DocumentTypeResponse {
  documentTypeId: number;
  documentType: string;
}

export interface CustomerSegmentResponse {
  id: number;
  parentSegmentId: number;
  name: string;
}

export interface TaxSourceResponse {
  crsTaxResidenceId: number;
  crsTaxResideceCode: string;
  crsTaxResideceDescription: string;
}

export interface BranchResponse {
  branchCode: string;
  branchName: string;
  branchId: number;
}

export interface AccountClosingResponse {
  reasonName: string;
  reasonId: number;
}

export interface UserResponse {
  user: string;
  userId: number;
}

export interface StatusResponse {
  status: string;
  statusId: number;
  statusType: string;
  isAuthorizable: boolean;
}

export function usePrefixesQuery() {
  return useQuery<PrefixItemResponse[], HttpClientError>(
    ["Prefixes"],
    () => fetchPhonePrefix(),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useDocumentCategoryTypeQuery() {
  return useQuery<DocumentCategoryTypeResponse[], HttpClientError>(
    ["DocumentCategoryType"],
    () => fetchDocumentCategoryType(),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useDocumentTypeQuery(
  categoryType?: number,
  customerSegment?: number
) {
  return useQuery<DocumentTypeResponse[], HttpClientError>(
    ["DocumentTypeQuery", categoryType, customerSegment],
    () => fetchDocumentType(categoryType, customerSegment),
    { refetchOnWindowFocus: false, retry: 1, enabled: !!categoryType }
  );
}

export function useCountriesQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CountriesQuery"],
    () => fetchCountries(),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useCitiesQuery(countryName?: string) {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CitiesQuery", countryName],
    () => fetchCities(countryName),
    { refetchOnWindowFocus: false, retry: 1, enabled: !!countryName }
  );
}

export function useAccountOfficersQuery(customerSegmentId?: number) {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["AccountOfficers", customerSegmentId],
    () => fetchAccountOfficers(customerSegmentId),
    { refetchOnWindowFocus: false, retry: 1, enabled: !!customerSegmentId }
  );
}

export function useSegmentCriteriasQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["SegmentCriterias"],
    fetchSegmentCriterias,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useServicesQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["Services"],
    fetchServices,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useCustomerServicesQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CustomerServices"],
    fetchCustomerServices,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useGendersQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["Genders"],
    fetchGenders,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useMaritalStatusesQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["MaritalStatuses"],
    fetchMaritalStatuses,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useCustomerDocumentType(customerSegmentId?: number) {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CustomerDocumentType", customerSegmentId],
    () => fetchCustomerDocumentType(customerSegmentId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useCustomerDocumentIssuer() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CustomerDocumentIssuer"],
    fetchCustomerDocumentIssuer,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useMainCustomerSegment() {
  return useQuery<
    { id: number; parentSegmentId: number; name: string }[],
    HttpClientError
  >(["MainCustomerSegment"], fetchMainCustomerSegment, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCustomerSegment(parentSegmentId?: number) {
  return useQuery<
    { id: number; parentSegmentId: number; name: string; isRetired: boolean }[],
    HttpClientError
  >(
    ["CustomerSegment", parentSegmentId],
    () => fetchCustomerSegment(parentSegmentId),
    { refetchOnWindowFocus: false, retry: 1, enabled: !!parentSegmentId }
  );
}

export function useTaxSourceQuery() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["CrsTaxSource"],
    fetchTaxSources,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useProfessionsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["Professions"],
    fetchProfessions,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useMinistriesQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["Ministries"],
    fetchMinistries,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useInstitutionsQuery(ministryId?: string) {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["Institutions"],
    () => fetchInstitutions(ministryId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useRiskRatingsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["RiskRatings"],
    fetchRiskRatings,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function usePlanProductsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["PlanProducts"],
    fetchPlanProducts,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useDataFromCustomerSegmentQuery(
  customerSegmentId: number,
  birthDate?: Date | undefined,
  idParty?: number | undefined
) {
  return useQuery<CustomerSegmentEventData, HttpClientError>(
    ["AddedInfo", customerSegmentId, birthDate, idParty],
    () => fetchDataFromCustomerSegment(customerSegmentId, birthDate, idParty),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      enabled: !!customerSegmentId,
    }
  );
}

export function useCustomerRiskClassificationsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["CustomerRiskClassifications"],
    fetchCustomerRiskClassifications,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useChoosingReasonsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["ChoosingReasons"],
    fetchChoosingReasons,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useAccountClosingReasonsQuery() {
  return useQuery<AccountClosingResponse[], HttpClientError>(
    ["AccountClosingReason"],
    fetchAccountClosingReasons,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useNaceCodesQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["NaceCodes"],
    fetchNaceCodes,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useEducationLevelsQuery() {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["EmploymentLevels"],
    fetchEducationLevels,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}
export function useDiligenceEmployTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["EmploymentTypeId"],
    fetchDiligenceEmployTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}
export function useFatcaStatusTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["StatusTypeId"],
    fetchFatcaStatusTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useSourceFundsTypes() {
  return useQuery<{ value: number; label: string }[], HttpClientError>(
    ["SourceFundType"],
    fetchSourceFundsTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useDiligenceBandTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["DiligenceBandType"],
    fetchDiligenceBandTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useTransactionCurrencyTypes() {
  return useQuery<{ value: number; label: string }[], HttpClientError>(
    ["TransactionCurrencyType"],
    fetchTransactionCurrencyTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useFrequencyTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["FrequencyType"],
    fetchFrequencyTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useFetchPurposeOfBankRelationTypes() {
  return useQuery<{ value: number; label: string }[], HttpClientError>(
    ["PurposeOfBankRelationType"],
    fetchPurposeOfBankRelationTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}
export function useFatcaDocumentTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["DocumentTypeId"],
    fetchFatcaDocumentTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useBranchesQuery() {
  return useQuery<BranchResponse[], HttpClientError>(
    ["Branches"],
    () => fetchBranches(),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: CacheExpiration.FiveMinutes,
    }
  );
}

export function useCurrentBranchQuery() {
  return useQuery<BranchResponse, HttpClientError>(
    ["CurrentBranch"],
    () => fetchCurrentBranch(),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: CacheExpiration.FiveMinutes,
    }
  );
}

export function useUsersQuery(branchId?: number, enabled = true) {
  return useQuery<UserResponse[], HttpClientError>(
    ["Users"],
    () => fetchUsers(branchId),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: CacheExpiration.FiveMinutes,
      enabled: enabled,
    }
  );
}

export function useCurrentUserQuery() {
  return useQuery<UserResponse, HttpClientError>(
    ["CurrentUser"],
    () => fetchCurrentUser(),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: CacheExpiration.FiveMinutes,
    }
  );
}

export function useCurrentUserRoleQuery() {
  return useQuery<string, HttpClientError>(
    ["CurrentUserRole"],
    () => fetchCurrentUserRole(),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}

export function useStatusesQuery() {
  return useQuery<StatusResponse[], HttpClientError>(
    ["Statuses"],
    () => fetchStatuses(),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useTypesOfCertificates() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["TypesOfCertificates"],
    fetchTypesOfCertificates,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useAddressedToTypes() {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["AddressedToTypes"],
    fetchAddressedToTypes,
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useStatementAuthorizedPersons(
  customerId: number,
  productId: number
) {
  return useQuery<{ id: number; name: string }[], HttpClientError>(
    ["StatementAuthorizedPersons", productId],
    () => fetchStatementAuthorizedPersons(customerId, productId),
    { refetchOnWindowFocus: false, retry: 1 }
  );
}

export function useActionTypes(actionType: string) {
  return useQuery<{ name: string; id: number }[], HttpClientError>(
    ["ActionTypes"],
    () => fetchActionTypes(actionType),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}
