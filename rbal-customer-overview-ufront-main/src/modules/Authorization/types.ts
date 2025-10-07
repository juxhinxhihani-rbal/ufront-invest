export enum AuthorizationTabs {
  Customers = "customers",
  Accounts = "accounts",
  Specimen = "specimens",
  AccountRights = "accountRights",
  DigitalBanking = "digitalBanking",
  Aml = "aml",
  Crs = "crs",
  More = "more",
}

export enum AmlAuthorizationDetailsTabs {
  CustomerInformation = "customerInformation",
  AdditionalInformation = "additionalInformation",
  DueDiligence = "dueDiligence",
  Notes = "notes",
}

export enum CrsAuthorizationDetailsTabs {
  CustomerInformation = "customerInformation",
  AdditionalInformation = "additionalInformation",
  Notes = "notes",
  Crs = "crs",
  Fatca = "fatca",
}

export type DefaultCustomerAuthorizationFiltersParams = {
  date?: string;
  customerNumber?: string;
  userId?: number | undefined;
  branchId?: number | undefined;
  pageNumber?: number | undefined;
  customerStatusId: number | undefined;
};

export type DefaultSpecimenAuthorizationFiltersParams = {
  dateTimeSpecimen?: string;
  customerNumber?: string;
  idUser?: number | undefined;
  idBranch?: number | undefined;
  pageNumber?: number | undefined;
  signatureStatusId: number | undefined;
};

export type DefaultAccountAuthorizationFiltersParams = {
  date: string | undefined;
  retailAccountNumber: string | undefined;
  userId: number | undefined;
  branchId: number | undefined;
  pageNumber: number | undefined;
  accountStatusId: number | undefined;
};

export type DefaultAccountRightsAuthorizationFiltersParams = {
  dateTimeAccountRights: string | undefined;
  customerNumber: string | undefined;
  userId: number | undefined;
  branchId: number | undefined;
  retailAccountNumber: string | undefined;
  pageNumber: number | undefined;
  signatureStatusId: number | undefined;
};

export type DefaultDigitalAuthorizationFiltersParams = {
  customerNumber: string | undefined;
  dateTimeDigital: string | undefined;
  idUser: number | undefined;
  idBranch: number | undefined;
  pageNumber: number | undefined;
};

export type DefaultAmlAuthorizationFiltersParams = {
  customerNumber: string | undefined;
  userId: number | undefined;
  branchId: number | undefined;
  pageNumber: number | undefined;
};

export type DefaultCrsAuthorizationFiltersParams = {
  customerNumber: string | undefined;
  userId: number | undefined;
  branchId: number | undefined;
  pageNumber: number | undefined;
};
