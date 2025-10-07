import { HttpClientError } from "@rbal-modern-luka/luka-portal-shell";
import { CountryCallingCode, NationalNumber } from "libphonenumber-js";
import { Query, QueryKey, UseQueryResult } from "react-query";
import {
  ChoosingReasonDto,
  InstitutionDto,
  MinistryDto,
  ProfessionDto,
} from "../dictionaries/dictionariesApi.types";

export type RefetchIntervalQuery<T> = Query<T, HttpClientError, T, QueryKey>;
export type RefetchIntervalParam<T> =
  | number
  | false
  | ((data: T | undefined, query: RefetchIntervalQuery<T>) => number | false)
  | undefined;

export interface ListCustomersResponse {
  customers: CustomerListingItem[];
  total: number;
}

export interface CustomerListingItem {
  id: number;
  name: string;
  nipt: number;
  status: CustomerStatus;
  sectorType: SectorType;
  birthDate: string;
  birthPlace: string;
  branchCode: string;
  customerNumber: string;
  customerSegment: string;
  documentNumber: string;
  lastSavedDate: string;
  lukaSignatureStatus: string;
  personalNumber: string;
  phoneNumber: number;
  screenDate: string;
  isNrpClosedLongTerm: boolean;
}

export interface AuthorizationCustomersListResponse {
  response: AuthorizationCustomerListItem[];
  totalPageNumber: number;
}

export interface AuthorizedPersonsQuery {
  query: UseQueryResult<CustomerAuthorizedPersonsResponse[], HttpClientError>;
  isDataEmpty: boolean;
  refresh: () => void;
}

export interface AuthorizationCustomerListItem {
  idParty: number;
  customerNumber: string;
  name: string;
  surname: string;
  fathersName: string;
  birthdate: string;
  birthPlace: string;
  lastSavedDate: string;
  address: string;
  dateChanged: string;
  userChanges: string;
  customerStatus: string;
}

export interface AuthorizationSpecimenListResponse {
  response: AuthorizationSpecimenListItem[];
  totalPageNumber: number;
}

export interface AuthorizationSpecimenListItem {
  idParty: number;
  customerNumber: string;
  nameSurnameFatherName: string;
  userInput: string;
  branchInput: string;
  dateInput: string;
  customerSegment: string;
  signitureStatus: string;
  signitureStatusColor: string;
}

export interface AccountRightsAuthorizationListResponse {
  response: AccountRightsAuthorizationResponseItem[];
  totalPageNumber: number;
}

export interface AccountRightsAuthorizationResponseItem {
  customerId: number;
  customerNumber: string;
  authorizedPersonCustomerId: number;
  authorizedPersonCustomerNumber: number;
  authorizationRightListId: number;
  retailAccountNumber: string;
  branchCreated: string;
  branchUpdated: string;
  headFullName: string;
  customerStatus: string;
  authorizedPersonName: string;
  dateInserted: string;
  userCreated: string;
  userAuthorized: string;
  customerType: string;
  customerSegment: string;
  statusColor: string;
}

export interface DigitalAuthorizationListResponse {
  response: DigitalAuthorizationResponseItem[];
  totalPageNumber: number;
}

export interface DigitalAuthorizationResponseItem {
  idApplication: number;
  idParty: number;
  dateTimeCreated: string;
  dateTimeUpdated: string;
  isActive: boolean;
  digitalBankingId: number;
  name: string;
  surname: string;
  fathersName: string;
  customerNumber: string;
  mobile: string;
  personalDocNumber: string;
  email: string;
  customerSegment: string;
  branchCreated: string;
  branchAmended: string;
  userCreated: string;
  userSaved: string;
}

export interface AmlAuthorizationListResponse {
  response: AmlAuthorizationResponseItem[];
  totalPagesNumber: number;
}

export interface AmlAuthorizationResponseItem {
  idParty: number;
  customerNumber: string;
  customerStatus: string;
  name: string;
  personalDocNumber: string;
  customerSegment: string;
  risk: number;
  openDate: string;
  userInput: string;
  userAssigned: string;
  partyType: string;
  bgColor: string;
  bgColorStatus: string;
}

export interface CrsAuthorizationListResponse {
  response: CrsAuthorizationResponseItem[];
  totalPagesNumber: number;
}

export interface CrsAuthorizationResponseItem {
  idParty: number;
  customerNumber: string;
  customerStatus: string;
  name: string;
  personalDocNumber: string;
  customerSegment: string;
  risk: number;
  openDate: string;
  userInput: string;
  crsStatus: string;
  userAssigned: string;
  partyType: string;
  bgColor: string;
  bgColorStatus: string;
}

export interface CustomerListingResponse {
  birthDate: string;
  birthPlace: string;
  branchCode: string;
  customerNumber: string;
  customerSegment: SectorType;
  customerStatus: CustomerStatus;
  documentNumber: string;
  fullName: string;
  idParty: number;
  lastSavedDate: string;
  lukaSignatureStatus: string;
  personalNumber: string;
  phoneNumber: number;
  screenDate: string;
  isNrpClosedLongTerm: boolean;
}

export interface AuthorizationAccountListItem {
  retailAccountNumber: number;
  accountNumber: string;
  currency: string;
  productId: number;
  isOpen: boolean;
  isActive: boolean;
  branch: string;
  minimumBalance: number;
  openCommission: number;
  closeCommission: number;
  accountToPostCrInterest: string;
  lastSavedDate: string;
  userModified: string;
  status: string;
  statusColor: string;
  segment: string;
}

export interface AuthorizationAccountListResponse {
  response: AuthorizationAccountListItem[];
  totalPageNumber: number;
}

export enum CustomerStatus {
  Active = "ACTIVE",
  Inactive = "CLOSED",
  OnHold = "ON_HOLD",
  WaitingForApproval = "WAITING_FOR_APPROVAL",
}

export interface CompanyData {
  nipt: string;
  courtDecisionNo: string;
  taxIdNo: string;
  dateOfCourtDecision: string;
}

export interface Address {
  line1: string | undefined;
  line2: string;
  city: string;
  zipCode: string;
}

export interface AddressData {
  residentialAddress: Address;
  countryOfResidenceCode: string;
}

export interface ContactData {
  mobilePhone1: string;
  mobilePhone3: string | undefined;
  mobilePhone2: string | undefined;
  email1: string;
  email2: string | undefined;
  email3: string | undefined;
}

export interface BankToCustomerRelationData {
  accountOfficer: string;
  customerSinceDate: string;
  mainGroupCode: string;
  segmentCode: string;
}

export interface EconomicCategory {
  sectorType: SectorType;
  ecEconomicActivityCode: string;
}

export interface GCC {
  name: string;
  id: string;
}

export interface LastActivityListingItem {
  actionType: CustomerRecentActionType;
  date: string;
  partyType: PartyType | undefined;
  value: string;
}

export enum CustomerRecentActionType {
  Payment = "LAST_PAYMENT",
  DigitalBankingLogin = "LAST_DIGITAL_BANKING_LOGIN",
  StatementOrder = "LAST_STATEMENT_ORDER",
}

export enum PartyType {
  Creditor = "CREDITOR",
  User = "USER",
  Representative = "REPRESENTATIVE",
}

export interface LegalRepresentativeListingItem {
  idCardNumber: string;
  fullName: string;
}

export interface CustomerWarningListingItem {
  eventType: CustomerWarningEventType;
  dueDate: string;
}

export enum CustomerWarningEventType {
  IdCardExpiry = "ID_CARD_EXPIRY",
  LoanContractAmendmentSigning = "LOAN_CONTRACT_AMENDMENT_SIGNING",
  MissingLoanDocument = "MISSING_LOAN_DOCUMENT",
}

export enum CustomerStatusCode {
  "Active" = 1,
  "Closed" = 2,
  "WaitingForAuthorization" = 5,
  "WaitingForSaveInMidas" = 7,
  "WaitingForResponseFromMidasInsert" = 9,
  "CustomerFailedToInsertBasicDetails" = 11,
  "CustomerFailedToSaveAdditional" = 14,
  "WaitingForResponseFromMidasUpdate" = 15,
  "CustomerFailedToUpdateBasicDetails" = 17,
  "CustomerFailedToUpdateAdditionalDetails" = 18,
  "ProfitCentreInsertFailed" = 19,
  "ProfitCentreUpdateFailed" = 20,
  "AdditionalAndProfitCentreInsertFailed" = 21,
  "AdditionalAndProfitCentreUpdateFailed" = 22,
  "WaitingInsertMidasCustomer247" = 24,
  "ActiveWaitingMidasAuthCustomer247" = 26,
  "SendBackForCorrections" = 179,
  "RejectPiForCrsApproval" = 172,
  "PendingInsert" = 200,
  "PendingUpdate" = 201,
}

export interface CreateCustomerDto {
  // TODO - remove or add in segment
  mainSegmentId: number | undefined;
  customerSegmentId: number | undefined;
  personalInfo: {
    firstName: string | undefined;
    lastName: string | undefined;
    fatherName: string | undefined;
    motherName: string | undefined;
    birthdate: string | undefined;
    countryOfBirthId: number | undefined;
    birthplace: string;
    genderId: number | undefined;
    martialStatusId: number | undefined;
    additionalLastName: string | undefined;
    isSalaryReceivedAtRbal: boolean | undefined;
    isRial: boolean | undefined;
    nationalityId: number | undefined;
  };
  document: {
    ssn: string | undefined;
    typeId: number | undefined;
    issuerId: number | undefined;
    number: string | undefined;
    // personalNumber: string | undefined;
    issueDate: string | undefined;
    expiryDate: string | undefined;
    isSsnNotRegularFormat: boolean | undefined;
  };
  contact: {
    mobileNumber: NationalNumber | undefined;
    alternativeMobileNumber: string | undefined;
    prefix: CountryCallingCode | undefined;
    email: string | undefined;
    isPhoneNumberVerified: boolean;
    isEmailVerified: boolean;
  };
  premiumData?: {
    accountOfficerId: number | undefined;
    segmentCriteriaId: number | undefined;
    premiumServiceId: number | undefined;
  };
  address: {
    address: string | undefined;
    countryId: number | undefined;
    cityId: number | undefined;
    zipCode: string | undefined;
  };
  individualInformation: {
    isWeb: boolean | undefined;
    isMobile: boolean | undefined;
    profileId: number | undefined;
    packagesId: number | undefined;
    securityElementId: number | undefined;
  };
  businessInformation?: {
    isWeb: boolean | undefined;
    isMobile: boolean | undefined;
  };
  employment: {
    professionId: number | undefined;
    // ministryId: number | undefined;
    // institutionId: number | undefined;
    dicasteryId: number | undefined;
  };
  amlData: {
    educationLevelId: number | undefined;
    overallRiskRating: number | undefined;
    dateOfDeath: string | undefined;
  };
  boaData: {
    boaSegmentId: number | undefined;
  };
  alternativeAddress: {
    currentAddress: string | undefined;
    countryOfResidenceId: number | undefined;
    nationalityId: number | undefined;
    cityOfResidenceId: number | undefined;
    countryOfTaxPaymentId: number | undefined;
    whyRaiffeisenId: number | undefined;
  };
  addedInfo: {
    planProductId: number | undefined;
    custRiskClassificationId: number | undefined;
    naceCodeId: number | undefined;
    amlExemptionId: number | undefined;
  };
  consents: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    cbChecked: boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    marketableChecked: boolean | undefined;
  };

  dueDiligence: {
    employment: DueDiligenceEmploymentDto;
    sourceOfIncome: SourceOfIncomeDto;
    bankingProducts: BankingProductsDto;
    cashTransactions: CashTransactionsDto;
    reasonOfUse: ReasonOfUseDto;
  };

  fatca: FatcaDto;
  crs: CrsDataDto[];
  crsDetails: CrsDetailsDataDto;

  choosingReasonId: number | undefined;
}

export interface CreateCustomerResponse {
  idParty?: number;
  message: string;
  isSuccessful: boolean;
}

export interface GetCustomerDocumentDto {
  customerId: string;
  authorizedPersonId?: string;
  retailAccountId?: string;
}

export interface CustomerDto {
  idParty: number;
  customerNumber?: string;
  customerInformation: CustomerInformationDto;
  additionalInformation: AdditionalInformationDto;
  digitalBanking: DigitalBankingDto;
  dueDiligence: DueDiligenceDto;
  crs: CrsDto;
  fatca: FatcaDto;
  isValid?: boolean;
  actions: string[];
  notes: NotesDto;
}

export interface CustomerInformationDto {
  mainSegmentId?: number;
  mainSegment?: string;
  midasStatus?: string;
  customerSegmentId?: number;
  customerSegment?: string;
  customerStatus?: CustomerStatusDto;
  branchCode?: string;
  branchName?: string;
  reportName?: string;
  auditInfo: AuditInfoDto;
  address: AddressDto;
  personalInfo: PersonalInfoDto;
  document: DocumentDto;
  contact: ContactDto;
  premiumData: PremiumDataDto;
  serviceInformation?: ServiceInformationDto;
  specimen?: SpecimenDto;
  bankData?: never;
  isChargeAccountNeeded?: boolean;
  isNrpClosedLongTerm?: boolean;
  parametrizationDetailId?: number;
  marketingGroup1?: string;
  marketingGroup2?: string;
  marketingGroup3?: string;
  profitCenter?: string;
  coconutType?: string;
  retCustGr?: string;
  isTaxIndicator?: boolean;
  lineOfBusiness?: string;
  institutionCode?: string;
  isRial?: boolean;
}

export interface CustomerStatusDto {
  customerStatusId?: number;
  status?: string;
  customerDescription?: string;
  description?: string;
  color?: string;
}

export interface CrsDto {
  crsDetails: CrsDetailsDto;
  crsTaxInformation: CrsTaxInformationDto[];
}

export interface CrsDetailsDto {
  crsSCDate: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crsCureFlag?: boolean;
  crsActionExpireDate: string;
  crsAction: string;
  enhanceReviewDateCrs: string;
  crsStatus: string;
}

export interface CrsTaxInformationDto {
  userCreatedId: number;
  idParty: number;
  branchCreatedId: number;
  countryId: number;
  crsTaxResidenceId: number;
  taxResidenceIndex: number;
  residenceTin: string;
  crsActionDetailInfo: string;
  crsStatusCode: string;
}

export interface CrsDataDto {
  idCountry?: number;
  idCrsTaxResidence?: number | undefined;
  taxResidenceIndex?: number;
  residenceTin?: string | undefined;
}

//TODO: change after BE is ready

export interface DigitalBankingDto {
  individualInformation: IndividualInformationDto;
  businessInformation: BusinessInformationDto;
  customerInformation: DigitalCustomerDto;
  actions: string[];
  applicationStatus: string;
}

export interface DigitalCustomerDto {
  customerNumber: string;
  customerSegment: string;
  name: string;
  surname: string;
  fatherName: string;
  personalNumber: string;
  mobileNumber: string;
  birthday: string;
  email: string;
}

export interface IndividualInformationDto {
  status: string;
  isMobile?: boolean;
  isWeb?: boolean;
  channel: string;
  webStatus: string;
  mobileStatus: string;
  registrationType: string;
  package: string;
  packageId?: number;
  securityElement: string;
  securityElementId?: number;
  profile: string;
  profileId?: number;
  userCreated: string;
  userSaved: string;
}

export interface BusinessInformationDto {
  status: string;
  isMobile?: boolean;
  isWeb?: boolean;
  channel: string;
  webStatus: string;
  mobileStatus: string;
}

export interface DueDiligenceDto {
  employment: DueDiligenceEmploymentDto;
  reasonOfUse: ReasonOfUseDto;
  sourceOfIncome: SourceOfIncomeDto;
  bankingProducts: BankingProductsDto;
  cashTransactions: CashTransactionsDto;
}

export interface DueDiligenceEmploymentDto {
  employmentTypeId?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  clientHasManagerialPosition?: boolean;
  specify?: string;
}

export interface ReasonOfUseDto {
  volumeOfUse?: string;
}

export interface SourceOfIncomeDto {
  sourceFundTypeIds: number[];
}

export interface BankingProductsDto {
  purposeOfBankRelationTypeIds: number[];
}

export interface CashTransactionsDto {
  hasCashTransaction?: boolean;
  transactionFrequencyId?: number;
  averageTransactionAmount?: number;
  currencyIds: number[];
  bandId?: number;
}

export interface AdditionalInformationDto {
  employment: EmploymentDto;
  amlData: AmlDto;
  boaData: BoaDto;
  alternativeAddress: AlternativeAddressDto;
  choosingReason: ChoosingReasonDto;
  addedInfo: AddedInfoDto;
  marketableCustomer: MarketableCustomerDto;
  cbConsent: CBConsentDto;
}

export type ReadAccountBalancesResponse = RetailAccountBalanceDto[];

export interface RetailAccountBalanceDto {
  retailAccountNumber: string;
  balance: number;
}

export interface CustomerRetailAccount {
  productId: number;
  retailAccountNumber: string;
  accountNumber: string;
  segment: string;
  status: string;
  isActive: boolean;
  commission: number;
  currency: string;
  isChargedAccount: boolean;
  isBlockDebit: boolean;
  isBlockCredit: boolean;
  isActiveInMidas: boolean;
  heldItem: number;
  shouldGenerateStatement: boolean;
  shouldApplyForCard: boolean;
  accountCode: string;
}

export interface CustomerDocumentListResponse {
  attachmentId: number;
  customerNumber: string;
  categoryId: number;
  categoryType: string;
  documentType: string;
  documentStatus: string;
  keyBaseAttachment: string;
  attachmentName: string;
  attachmentType: string;
  atthachmentStatus: number;
  dateTimeCreated: string;
  userCreated: string;
  branchCode: string;
  documentTypeId: number;
  isSavedOnS3: boolean;
  fileCorrelationId: string;
}

export interface UnformattedCustomerAuthorizedPersonsResponse {
  idParty: number;
  customerNumber?: string;
  reportName?: string;
  birthdate?: string;
  countryOfResidenceId?: number;
  nationalityId: number;
  countryOfBirthId: number;
  typeId: number;
  countryId: number;
  countryCodeMobile?: string;
  documentNumber?: string;
  mobileNumber?: string;
  branchUser?: string;
  authorizedDate: string;
  isActive?: boolean;
  authorizedPersonSignature?: CustomerSignature;
  crs: CrsDto;
}

export interface CustomerAuthorizedPersonsResponse {
  idParty: number;
  customerNumber?: string;
  reportName?: string;
  birthdate?: string;
  documentNumber?: string;
  mobileNumber?: string;
  branchUser?: string;
  authorizedDate: string;
  isActive?: boolean;
  authorizedPersonSignature?: CustomerSignature;
  crs: CrsDto;
  customerInformation: {
    personalInfo: Pick<
      PersonalInfoDto,
      "countryOfResidenceId" | "countryOfBirthId" | "nationalityId"
    >;
    document: Pick<DocumentDto, "typeId">;
    address: Pick<AddressDto, "countryId">;
    contact: Pick<ContactDto, "countryCodeMobile">;
  };
}

export interface CustomerSignature {
  signatureStatusId?: number;
  signatureStatus?: string;
  statusColor?: string;
}

export type AccountRightsModel = {
  [key: number]: AccountRightsInfo[];
};

export type AccountRightsDto = {
  productId: number;
  rights: AccountRightsInfo[];
}[];

export type AccountRightUpdateDto = {
  productId: number;
  rights?: {
    id: number;
    idCurrencyLimit: number;
    maxTransactionAmount?: number;
    upToAmount?: number;
    overThisAmount?: number;
    transactionFrequency?: number;
    isActive: boolean;
  }[];
}[];

export enum CustomerType {
  Private = 1,
  Business = 2,
}

export interface AccountRightsInfo {
  id: number;
  authorizationRight?: string;
  description?: string;
  maxTransactionAmount?: number;
  upToAmount?: number;
  overThisAmount?: number;
  orderDisplayRow?: number;
  transactionFrequency?: number;
  idCurrencyLimit?: number;
}

export interface PremiumDataDto {
  accountOfficerId?: number;
  accountOfficerName: string;
  segmentCriteriaId?: number;
  segmentCriteriaName: string;
  premiumService: string | undefined;
  premiumServiceId?: number;
}

export interface ServiceInformationDto {
  premiumServiceId?: number;
  premiumService: string | undefined;
}

export interface SpecimenDto {
  idParty?: number;
  customerName?: string;
  customerNumber?: string;
  status?: string;
  color?: string;
}

export interface CrsDetailsDataDto {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crsCureFlag: boolean;
  crsSCDate: string;
  crsAction?: string;
  crsActionExpireDate: string;
  enhanceReviewDateCrs: string;
  crsStatus?: string;
}

export interface CrsTaxInformationDataDto {
  userCreatedId: number;
  idParty: number;
  branchCreatedId: number;
  countryId: number;
  crsTaxResidenceId: number;
  taxResidenceIndex: number;
  residenceTin: string;
  crsstatuscode: string;
  action: string;
}

export interface AuditInfoDto {
  createdBy: string;
  createdDate: string;
  modifiedBy: string | undefined;
  modifiedDate: string | undefined;
  authorizedBy: string | undefined;
  authorizationDate: string | undefined;
}
export interface AddressDto {
  countryId: number;
  country: string;
  address: string;
  cityId: number;
  city: string;
  zipCode: string;
}
export interface PersonalInfoDto {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  birthdate: string;
  birthplace: string;
  nationality: string;
  nationalityId: number;
  countryOfBirthId: number;
  countryOfBirth: string;
  genderId: number;
  gender: string;
  martialStatusId: number;
  martialStatus: string;
  additionalLastName: string | undefined;
  isSalaryReceivedAtRbal?: boolean;
  countryOfResidenceId?: number;
  countryOfResidence?: string;
  cityOfResidence?: string;
  isRial?: boolean;
}

export interface DocumentDto {
  typeId: number;
  type: string;
  issuerId: number;
  issuer: string;
  number: string;
  ssn: string;
  issueDate: string;
  expiryDate: string;
  isSsnNotRegularFormat: boolean | undefined;
  lineOfBusiness?: string;
  accountOfficerCode?: string;
}

export interface ContactDto {
  mobileNumber: NationalNumber | undefined;
  alternativeMobileNumber: string | undefined;
  prefixId: number;
  prefix: CountryCallingCode | undefined;
  email: string;
  countryCodeMobile: string | undefined;
  isEmailValidated: boolean;
  isPhoneNumberVerified: boolean;
}

export interface EmploymentDto {
  profession: ProfessionDto;
  ministry: MinistryDto;
  institution: InstitutionDto;
}

export interface AmlDto {
  educationLevelId: number;
  educationLevel: string | undefined;
  overallRiskRating: number;
  deathDate: string | undefined;
  riskRating: string | undefined;
  documentStatus: string | undefined;
}

export interface BoaDto {
  boaSegmentId: number | undefined;
  boaSegment: string | undefined;
  description: string | undefined;
}

export interface AlternativeAddressDto {
  residentialAddress: string | undefined;
  countryResidenceId: number;
  countryResidence: string | undefined;
  citizenshipId: number;
  citizenship: string | undefined;
  cityResidenceId: number;
  cityResidence: string | undefined;
  stateOfTaxPaymentId: number;
  stateOfTaxPayment: string | undefined;
}

export interface AddedInfoDto {
  planProductId?: number;
  planProduct: string | undefined;
  custRiskClassificationId: number;
  custRiskClassification: string | undefined;
  naceCodeId: number;
  naceCode: string | undefined;
  amlExemptionId: number;
  amlExemption: string | undefined;
  isPep?: boolean;
  isFisa?: boolean;
}

export interface MarketableCustomerDto {
  branchOrDigital: ConsentStatus;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marketableCustomer: boolean;
  marketableCustomerDateTime: string;
}

export interface CBConsentDto {
  branchOrDigital: ConsentStatus;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cbConsentAgreed?: boolean;
  cbConsentDateTime: string;
}

export interface FatcaDto {
  fatcaInformation?: FatcaInformationDto;
}

export interface FatcaInformationDto {
  documentType?: number;
  statusDate: string | undefined;
  status?: number;
  documentaryDeadline: string | undefined;
  documentaryDate: string | undefined;
  fciAction?: string | undefined;
}

export interface NotesDto {
  amlUserId?: string;
  authRetailUserId?: string;
  amlAuthNote?: string;
  crsAuthNote?: string;
  userAmlAuth?: string;
  amlDateTimeAuth?: string;
  retailAuthNote?: string;
  userRetailAuth?: string;
  retailDateTimeAuth?: string;
}

export enum CountryCode {
  Albania = "ALB",
  Usa = "US",
}

export enum ConsentStatus {
  BranchYes = "BranchYes",
  BranchNo = "BranchNo",
  DigitalYes = "DigitalYes",
  DigitalNo = "DigitalNo",
  None = "None",
}

export enum CustomerSegmentKey {
  MainSegmentId = "mainSegmentId",
  CustomerSegmentId = "customerSegmentId",
  CustomerNumber = "customerNumber",
}

export enum SectorType {
  Agriculture = "AGRICULTURE",
  Fishing = "FISHING",
  Horticulture = "HORTICULTURE",
  Tobacco = "TOBACCO",
  Wood = "WOOD",
  Aerospace = "AEROSPACE",
  Automotive = "AUTOMOTIVE",
  Chemical = "CHEMICAL",
  Pharmaceutical = "PHARMACEUTICAL",
  Construction = "CONSTRUCTION",
  Defense = "DEFENSE",
  Arms = "ARMS",
  ElectricPower = "ELECTRIC POWER",
  Electronics = "ELECTRONICS",
  Computer = "COMPUTER",
  Semiconductor = "SEMICONDUCTOR",
  Energy = "ENERGY",
  Food = "FOOD",
  IndustrialRobot = "INDUSTRIAL_ROBOT",
  LowTechnology = "LOW_TECHNOLOGY",
  Meat = "MEAT",
  MeatPacking = "MEAT_PACKING",
  Mining = "MINING",
  Petroleum = "PETROLEUM",
  OilShale = "OIL_SHALE",
  PulpAndPaper = "PULP_AND_PAPER",
  Steel = "STEEL",
  Shipbuilding = "SHIPBUILDING",
  Telecommunications = "TELECOMMUNICATIONS",
  Textile = "TEXTILE",
  Water = "WATER",
  Creative = "CREATIVE",
  Advertising = "ADVERTISING",
  Fashion = "FASHION",
  Floral = "FLORAL",
  Cultural = "CULTURAL",
  Culture = "CULTURE",
  Education = "EDUCATION",
  Film = "FILM",
  Gambling = "GAMBLING",
  Music = "MUSIC",
  VideoGame = "VIDEO_GAME",
  FinancialServices = "FINANCIAL_SERVICES",
  Insurance = "INSURANCE",
  Healthcare = "HEALTHCARE",
  Hospitality = "HOSPITALITY",
  Information = "INFORMATION",
  Leisure = "LEISURE",
  MassMedia = "MASS_MEDIA",
  Broadcasting = "BROADCASTING",
  Internet = "INTERNET",
  NewsMedia = "NEWS_MEDIA",
  Publishing = "PUBLISHING",
  Entertainment = "ENTERTAINMENT",
  ProfessionalServices = "PROFESSIONAL_SERVICES",
  RealEstate = "REAL_ESTATE",
  Retail = "RETAIL",
  Software = "SOFTWARE",
  Sport = "SPORT",
  Transport = "TRANSPORT",
}

export interface CustomerUpdateDto {
  idParty: number;
  customerSegmentId: number | undefined;
  personalInfo: PersonalInfoUpdateDto;
  document: DocumentUpdateDto;
  contact: ContactUpdateDto;
  premiumData?: PremiumDataUpdateDto;
  address: AddressUpdateDto;
  individualInformation: IndividualInformationUpdateDto;
  businessInformation?: BusinessInformationUpdateDto;
  consents?: ConsentsUpdateDto;
  fatca?: FatcaUpdateDto;
  dueDiligence?: DueDiligenceUpdateDto;
  employment: EmploymentUpdateDto;
  amlData: AmlUpdateDto;
  boaData: BoaUpdateDto;
  alternativeAddress: AlternativeAddressUpdateDto;
  choosingReason: ChoosingReasonUpdateDto;
  addedInfo: AddedInfoUpdateDto;
  crs: CrsTaxInformationUpdateDto[];
  crsDetails: CrsDetailsUpdateDto;
}

interface PersonalInfoUpdateDto {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string | undefined;
  birthdate: string | undefined;
  countryOfBirthId: number | undefined;
  birthplace: string;
  nationalityId: number;
  genderId: number;
  martialStatusId: number | undefined;
  additionalLastName: string | undefined;
  isSalaryReceivedAtRbal: boolean | undefined;
  isRial: boolean | undefined;
}

interface DocumentUpdateDto {
  ssn: string;
  typeId: number;
  issuerId: number | undefined;
  number: string;
  issueDate: string | undefined;
  expiryDate: string | undefined;
  isSsnNotRegularFormat: boolean | undefined;
}

interface ContactUpdateDto {
  mobileNumber: NationalNumber | undefined;
  alternativeMobileNumber: string | undefined;
  prefix: string | undefined;
  email: string;
  isEmailVerified: boolean;
  isPhoneNumberVerified: boolean;
}

interface PremiumDataUpdateDto {
  accountOfficerId: number | undefined;
  segmentCriteriaId: number | undefined;
  premiumServiceId: number | undefined;
}

interface AddressUpdateDto {
  address: string;
  countryId: number | undefined;
  cityId: number | undefined;
  zipCode: string;
}

interface IndividualInformationUpdateDto {
  isWeb: boolean | undefined;
  isMobile: boolean | undefined;
  profileId: number | undefined;
  packagesId: number | undefined;
  securityElementId: number | undefined;
}

interface BusinessInformationUpdateDto {
  isWeb: boolean | undefined;
  isMobile: boolean | undefined;
}

interface ConsentsUpdateDto {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  cbChecked: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marketableChecked: boolean | undefined;
}

interface FatcaUpdateDto {
  fatcaInformation: FatcaInformationUpdateDto;
}

interface FatcaInformationUpdateDto {
  documentType: number | undefined;
  statusDate: string | undefined;
  status: number | undefined;
  documentaryDeadline: string | undefined;
  documentaryDate: string | undefined;
}

interface CrsDetailsUpdateDto {
  crsSCDate: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crsCureFlag: boolean;
  crsActionExpireDate?: string;
  enhanceReviewDateCrs?: string;
}

interface CrsTaxInformationUpdateDto {
  idCountry: number;
  idCrsTaxResidence: number;
  taxResidenceIndex: number;
  residenceTin: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DueDiligenceUpdateDto extends DueDiligenceDto {}

interface EmploymentUpdateDto {
  professionId: number | undefined;
  dicasteryId: number | undefined;
}

interface AmlUpdateDto {
  educationLevelId: number | undefined;
  overallRiskRating: number | undefined;
  deathDate: string | undefined;
}

interface BoaUpdateDto {
  boaSegmentId: number | undefined;
}

interface AlternativeAddressUpdateDto {
  residentialAddress: string | undefined;
  countryResidenceId: number | undefined;
  citizenshipId: number | undefined;
  cityResidenceId: number | undefined;
  stateOfTaxPaymentId: number | undefined;
}

interface ChoosingReasonUpdateDto {
  choosingReasonId: number | undefined;
}

interface AddedInfoUpdateDto {
  planProductId: number | undefined;
  customerRiskClassificationId: number | undefined;
  naceCodeId: number | undefined;
  amlExemptionId: number | undefined;
  isPep: boolean | undefined;
  isFisa: boolean | undefined;
}

export interface ResegmentationResponse {
  state: CustomerStatusCode;
  requiredFields: keyof CustomerUpdateDto[];
}

export interface CustomerResegmentationProcessDto {
  customerSegmentId?: number;
  premiumDataUpdate?: {
    accountOfficerId?: number;
    segmentCriteriaId?: number;
    premiumService?: string;
  };
}

export interface ResegmentResponse {
  state: string;
  requiredFields?: string[];
}

export enum SignatureStatusCode {
  SpecimenAccountRightsWaitingRevoked = 50,
  SpecimenAccountRightsWaitingAuthorization = 46,
  SpecimenAuthorizedPersonInserted = 43,
}

export interface ExistingCustomerRequest {
  firstName: string;
  lastName: string;
  fatherName: string;
  birthdate: string;
  birthplace: string | undefined;
  personalDocumentNumber: string;
}

export enum MidasStatus {
  Active = "Active",
  Closed = "Closed",
}

export interface CustomerSpecimenResponse {
  customerName?: string;
  customerNumber?: string;
  status?: string;
  color?: string;
  encodedSpecimen?: string;
}

export enum RegistrationType {
  Branch = "Branch",
  Online = "Online",
}

export interface UpdateCustomerChargeAccountResponse {
  productId: number;
  isSuccessful: boolean;
}

export interface AvailableCustomerDocument {
  name: string;
  url: string;
  shouldShowUrl: boolean;
}

export enum PremiumServiceIds {
  Branch = 1,
  DegeBranch = 3,
}
export enum ExistsMode {
  Create = "Create",
  Update = "Update",
}

export enum AccountOfficer {
  Other = 275,
}

export interface SendCustomerDocumentResponse {
  errorMessage?: string;
  isSent: boolean;
}

export interface FshuContractDto {
  custName: string;
  customerNo: string;
}
