import {
  AccountRightsStatusCode,
  AccountStatusCode,
  SpecimenStatusCode,
} from "~/api/authorization/authorizationApi.types";
import { CustomerStatusCode } from "~/api/customer/customerApi.types";
import {
  DefaultAccountAuthorizationFiltersParams,
  DefaultAccountRightsAuthorizationFiltersParams,
  DefaultAmlAuthorizationFiltersParams,
  DefaultCrsAuthorizationFiltersParams,
  DefaultCustomerAuthorizationFiltersParams,
  DefaultDigitalAuthorizationFiltersParams,
  DefaultSpecimenAuthorizationFiltersParams,
} from "./types";

export const defaultCustomerAuthorizationFilters: DefaultCustomerAuthorizationFiltersParams =
  {
    date: undefined,
    customerNumber: "",
    userId: 0,
    branchId: undefined,
    pageNumber: 1,
    customerStatusId: CustomerStatusCode.WaitingForAuthorization,
  };

export const defaultSpecimenAuthorizationFilters: DefaultSpecimenAuthorizationFiltersParams =
  {
    dateTimeSpecimen: undefined,
    customerNumber: "",
    idUser: 0,
    idBranch: undefined,
    pageNumber: 1,
    signatureStatusId: SpecimenStatusCode.SpecimenSignatureWaitingAuthorization,
  };

export const defaultAccountAuthorizationFilters: DefaultAccountAuthorizationFiltersParams =
  {
    date: undefined,
    retailAccountNumber: undefined,
    userId: 0,
    branchId: undefined,
    pageNumber: 1,
    accountStatusId: AccountStatusCode.WaitingForAuthorizationInLuka,
  };

export const defaultAccountRightsAuthorizationFilters: DefaultAccountRightsAuthorizationFiltersParams =
  {
    dateTimeAccountRights: undefined,
    customerNumber: "",
    userId: 0,
    branchId: undefined,
    retailAccountNumber: undefined,
    pageNumber: 1,
    signatureStatusId:
      AccountRightsStatusCode.SpecimenAccountRightsWaitingAuthorization,
  };

export const defaultDigitalAuthorizationFilters: DefaultDigitalAuthorizationFiltersParams =
  {
    customerNumber: "",
    dateTimeDigital: undefined,
    idUser: 0,
    idBranch: undefined,
    pageNumber: 1,
  };

export const defaultAmlAuthorizationFilters: DefaultAmlAuthorizationFiltersParams =
  {
    customerNumber: "",
    userId: 0,
    branchId: undefined,
    pageNumber: 1,
  };

export const defaultCrsAuthorizationFilters: DefaultCrsAuthorizationFiltersParams =
  {
    customerNumber: "",
    userId: 0,
    branchId: undefined,
    pageNumber: 1,
  };
