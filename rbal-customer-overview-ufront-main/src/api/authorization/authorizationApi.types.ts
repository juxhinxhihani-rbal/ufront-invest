import { NationalNumber } from "libphonenumber-js";
import {
  AdditionalInformationDto,
  CrsTaxInformationDto,
  CustomerInformationDto,
  DueDiligenceDto,
} from "../customer/customerApi.types";

export enum FieldType {
  DateTime = "DateTime",
  String = "String",
}

export interface Change {
  segment: string;
  fieldName: string;
  type: FieldType;
  oldValue: string;
  newValue: string;
}

export interface AuthorizationChangesResponse {
  customerId: number;
  changes: Change[];
}

export interface RejectCustomerChangesResponse {
  isSuccessful: boolean;
  rejectedAccountNumbers: string[];
}

export interface AuthorizeSpecimenResponse {
  isSuccessful: boolean;
}

export interface AccountAuthorizationResponse {
  message: AccountAuthorizationMessageCode;
  isAuthorized: boolean;
}

export interface AccountRejectionResponse {
  message: string;
  isRejected: boolean;
}

export interface AmlAuthorizationResponse {
  message: AccountAuthorizationMessageCode;
  isApproved: boolean;
}

export interface AmlRejectionResponse {
  message: string;
  isRejected: boolean;
}
export interface CrsAuthorizationResponse {
  approveMessage: string;
  isAuthorized: boolean;
}

export interface CrsRejectionResponse {
  message: string;
  isRejected: boolean;
}

export enum AuthorizeStatus {
  Authorize = "Authorize",
  NonAuthorizeYourself = "NonAuthorizeYourself",
  Activation = "Activation",
  NonAuthorize = "NonAuthorize",
  NoRelease = "NoRelease",
}

export enum AccountAuthorizeStatus {
  AccountAuthorize = "AccountAuthorize",
  AccountNonAuthorize = "AccountNonAuthorize",
  ReportNameChange = "ReportNameChange",
  ReportNameNonChange = "ReportNameNonChange",
}

export enum AuthorizationStatusType {
  Customer = "Customer",
  Signature = "Signature",
  Account = "Account",
  AuthorizedPerson = "AuthorizedPerson",
  AccountRights = "AccountRights",
  DigitalBanking = "DigitalBanking",
}

export enum SpecimenStatusCode {
  "SpecimenSignatureCustomerActive" = 41,
  "SpecimenSignatureWaitingAuthorization" = 45,
}

export enum AccountRightsStatusCode {
  "SpecimenAccountRightsWaitingAuthorization" = 46,
  "SpecimenAccountRightsWaitingRevoked" = 50,
}

export enum AccountStatusCode {
  "Open" = 1,
  "WaitingForAuthorizationInLuka" = 6,
  "WaitingForActivation" = 13,
  "MarkuarPerEbanking" = 15,
  "RemovFromEbanking" = 16,
  "MarkuarperMbanking" = 17,
  "RemoveFromMbanking" = 18,
  "AccountIsReadyToClose" = 21,
}

export enum DigitalStatusCode {
  "DigitalBankingApplicationSendForAuthorization" = 1,
  "DigitalBankingApplicationAuthorized" = 6,
  "DigitalBankingUserBlocked" = 3,
  "DigitalBankingUserUnblocked" = 4,
  "DigitalBankingApplicationRejectedFromBm" = 5,
  "UserEnrolled" = 6,
  "UserUnsubscribed" = 7,
  "DigitalUserApplicationSendForAuthorization" = 8,
  "DigitalUserSentForRemoval" = 9,
  "DigitalUserRemovalApprouved" = 10,
  "DigitalUserBlockedWeb" = 11,
  "DigitalUserBlockedMobile" = 12,
  "DigitalUserSentForActivation" = 13,
  "DigitalUserActivationApprouved" = 14,
  "DigitalUserActivateWeb" = 15,
  "DigitalUserActivateMobile" = 16,
  "DigitalUserWaitingAuthorizationNewRole" = 17,
  "DigitalLendingAuthorized" = 18,
  "Default" = 19,
}

export enum AccountAuthorizationMessageCode {
  AccountActivated,
  AccountNotActivated,
  AccountClosed,
  AccountNotClosed,
  AccountDeleted,
  AccountNotDeleted,
  AccountNotSentToEbanking,
  AccountDeleteFromEbanking,
  AccountNotDeleteFromEbankin,
  AccountSentToMbanking,
  AccountNotSentToMbanking,
  AccountDeleteFromMbanking,
  AccountNotDeleteFromMbanking,
  AccountSavedToMidas,
  AccountNotSavedToMidas,
}

export interface CustomerAuthorizeResponse {
  authorizeStatus?: AuthorizeStatus;
  errorMessage?: string;
  accountAuthorization: {
    accountAuthorizeStatus?: AccountAuthorizeStatus;
    accountNumbers: string[];
  }[];
}

export interface ActivateMidasCustomerResponse
  extends CustomerAuthorizeResponse {
  isActivated: boolean;
}

export interface SpecimenDetailsDto {
  customerNumber: string;
  customerName: string;
  status: string;
  color: string;
  encodedSpecimen: string;
}

export interface AuthorizableAccountDto {
  basicData: AccountBasicData;
  indicators: AccountIndicators;
  commissions: AccountCommissions;
  otherData: AccountOtherData;
}

export interface AccountBasicData {
  accountId: number;
  reportName: string;
  customerSegment: string;
  product: string;
  customerNumber: string;
  ccy: string;
  accountCode: string;
  accountSequence: string;
  branchCode: string;
  accountNumber: string;
  retailAccountNumber: string;
  iban: string;
}

export interface AccountIndicators {
  isOpen: boolean | undefined;
  isActive: boolean | undefined;
  isDebitBlocked: boolean | undefined;
  isCreditBlocked: boolean | undefined;
  isDebitReferred: boolean | undefined;
  isCreditReferred: boolean | undefined;
  isBadDebt: boolean | undefined;
  isBankrupt: boolean | undefined;
}

export interface AccountCommissions {
  maintainance: number;
  drIntTypeSType: string;
  closeCommission: number;
  crIntTypeSType: string;
  minimumBalance: number;
  intCalcBasis: number;
  chargeCalcTypeSType: string;
  accToPostDrCrInterest: string;
}

export interface AccountOtherData {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  authorizedBy: string;
  authorizedDate: string;
}

export interface AccountRightsAuthorizationResponse {
  accountOwner: string;
  client: string;
  relationType: string;
  accountOwnerCustomerNumber: string;
  clientCustomerNumber: string;
  notes: string;
  authorizationRightsList: AccountRightsAuthorizationRightsList[];
}

export interface AccountRightsAuthorizationRightsList {
  authorizedPersonId: number;
  authorizationRightId: number;
  retailAccountNumber: number;
  authorizationRight: string;
  isSelected: boolean;
  maxTransactionAmount: number;
  frequency: number;
  currencyLimitId: number;
}

export interface AccountRightsApprovedResponse {
  message: string;
  isAuthorized: boolean;
}

export interface AccountRightsRejectionResponse {
  message: string;
  isSuccessful: boolean;
}

export interface DigitalBankingAuthorizationResponse {
  customerNumber: string;
  name: string;
  surname: string;
  fatherName: string;
  personalNumber: string;
  mobileNumber: string;
  customerSegment: string;
  email: string;
  digitalBankingData: DigitalBankingData;
}

export interface DigitalBankingData {
  profile: string;
  mobileNumber: string;
  userCreated: string;
  userSaved: string;
  isWebEnabled: boolean;
  isMobileEnabled: boolean;
}

export interface AmlAuthorizationDetailsDto {
  customerInformation: AmlCustomerInformationData;
  additionalInformation: AmlAdditionalInformationData;
  dueDiligence: AmlDueDiligenceData;
  notes: AmlNotesData;
}

export interface AuthorizationAmlCustomerDetailsDto {
  idParty: string;
  customerNumber: string;
  customerInformation: CustomerInformationDto;
  additionalInformation: AdditionalInformationDto;
  dueDiligence: DueDiligenceDto;
  notes: AmlNotesData;
  additionalAmlInfoDto: AdditionalAmlInfoDto;
  isValid: boolean;
  crsStatus: string;
}

export interface AdditionalAmlInfoDto {
  lineOfBusiness: string;
  accountOfficerCode: string;
}

export interface AmlCustomerInformationData {
  personalData: AmlPersonalData;
  documentData: AmlDocumentData;
  addressData: AmlAddressData;
  contactData: AmlContactData;
  customerStatus: AmlCustomerStatus;
}

export interface AmlCustomerStatus {
  color: string;
  customerDescription: string;
  customerStatusId: number;
  status: string;
  statusDescription: string;
}

export interface AmlAdditionalInformationData {
  employmentData: AmlEmploymentData;
  amlData: AmlData;
}

export interface AmlEmploymentData {
  proffesion: string;
  ministry: string;
  institution: string;
}

export interface AmlData {
  educationLevel: string;
  overallRiskRating: number;
  naceCode: string;
  riskRating: string;
  lineOfBusiness: string;
  accountOfficerCode: string;
  prodLine: string;
  isPep: boolean;
  isFisa: boolean;
  crsStatus: string;
}

export interface AmlDueDiligenceData {
  employment: string;
  isActForThirdParty: boolean;
  expectedVolumesOfTrnx: string;
  sourceOfFunds: number[];
  relationPurposeWithBank: number[];
  hasCashTransationWithBank?: boolean;
  transactionFrequency: number;
  transactionAmount: number;
  transactionCurrency: number[];
  bandId: number;
}

export interface AmlNotesData {
  amlAuthorizationCommentsApproval: string;
  userAmlAuth: string;
  amlDateTimeAuth: string;
  retailKycUserNotes: string;
  userRetailAuth: string;
  retailDateTimeAuth: string;
}

export interface AmlPersonalData {
  customerNumber: string;
  name: string;
  surname: string;
  fatherName: string;
  motherName: string;
  birthdate: string;
  nationality: string;
  contryOfBirth: string;
  birthplace: string;
  gender: string;
  civilStatus: string;
  additionalLastName?: string;
}

export interface AmlDocumentData {
  documentType: string;
  authorityIssue: string;
  documentNumber: string;
  personalNumber: string;
  issueDate: string;
  expiryDate: string;
}

export interface AmlAddressData {
  address: string;
  countryOfResidence: string;
  cityOfResidence: string;
}

export interface AmlContactData {
  mobileNumber: NationalNumber | undefined;
  alternativeNumber?: string;
  workMobile: string;
  fax: string;
  email: string;
}

export const mapAmlDataFromAuthorizationAmlCustomerDetailsDto = (
  customer: AuthorizationAmlCustomerDetailsDto
): AmlAuthorizationDetailsDto => {
  return {
    customerInformation: {
      personalData: {
        customerNumber: customer.customerNumber,
        name: customer.customerInformation.personalInfo.firstName,
        surname: customer.customerInformation.personalInfo.lastName,
        fatherName: customer.customerInformation.personalInfo.fatherName,
        motherName: customer.customerInformation.personalInfo.motherName,
        birthdate: customer.customerInformation.personalInfo.birthdate,
        nationality: customer.customerInformation.personalInfo.nationality,
        contryOfBirth: customer.customerInformation.personalInfo.countryOfBirth,
        birthplace: customer.customerInformation.personalInfo.birthplace,
        gender: customer.customerInformation.personalInfo.gender,
        civilStatus: customer.customerInformation.personalInfo.martialStatus,
        additionalLastName:
          customer.customerInformation.personalInfo.additionalLastName,
      },
      documentData: {
        documentType: customer.customerInformation.document.type,
        authorityIssue: customer.customerInformation.document.issuer,
        documentNumber: customer.customerInformation.document.number,
        personalNumber: customer.customerInformation.document.ssn,
        issueDate: customer.customerInformation.document.issueDate,
        expiryDate: customer.customerInformation.document.expiryDate,
      },
      addressData: {
        address: customer.customerInformation.address.address,
        countryOfResidence:
          customer.customerInformation.personalInfo.countryOfResidence ?? "",
        cityOfResidence:
          customer.customerInformation.personalInfo.cityOfResidence ?? "",
      },
      contactData: {
        mobileNumber: customer.customerInformation.contact.mobileNumber,
        alternativeNumber:
          customer.customerInformation.contact.alternativeMobileNumber,
        workMobile: "",
        fax: "",
        email: customer.customerInformation.contact.email,
      },
      customerStatus: {
        color: customer.customerInformation?.customerStatus?.color ?? "",
        customerDescription:
          customer.customerInformation?.customerStatus?.description ?? "",
        customerStatusId:
          customer.customerInformation?.customerStatus?.customerStatusId ?? 0,
        status: customer.customerInformation?.customerStatus?.status ?? "",
        statusDescription:
          customer.customerInformation?.customerStatus?.description ?? "",
      },
    },
    additionalInformation: {
      employmentData: {
        proffesion:
          customer.additionalInformation?.employment?.profession?.profession ??
          "",
        ministry:
          customer.additionalInformation?.employment?.ministry.ministry ?? "",
        institution:
          customer.additionalInformation?.employment?.institution.dicastery ??
          "",
      },
      amlData: {
        educationLevel:
          customer.additionalInformation?.amlData?.educationLevel ?? "",
        overallRiskRating:
          customer.additionalInformation?.amlData?.overallRiskRating,
        lineOfBusiness: customer.additionalAmlInfoDto?.lineOfBusiness ?? "",
        accountOfficerCode:
          customer.additionalAmlInfoDto.accountOfficerCode ?? "",
        naceCode: customer.additionalInformation?.addedInfo.naceCode ?? "",
        riskRating: customer.additionalInformation?.amlData.riskRating ?? "",
        prodLine: customer.additionalInformation?.addedInfo?.planProduct ?? "",
        isPep: customer.additionalInformation?.addedInfo.isPep ?? false,
        isFisa: customer.additionalInformation?.addedInfo.isFisa ?? false,
        crsStatus: customer.crsStatus ?? "",
      },
    },
    dueDiligence: {
      employment:
        customer.additionalInformation.employment?.profession?.profession ?? "",
      isActForThirdParty: false,
      expectedVolumesOfTrnx:
        customer.dueDiligence?.reasonOfUse.volumeOfUse ?? "",
      sourceOfFunds:
        customer.dueDiligence?.sourceOfIncome?.sourceFundTypeIds ?? [],
      relationPurposeWithBank:
        customer.dueDiligence?.bankingProducts?.purposeOfBankRelationTypeIds ??
        [],
      hasCashTransationWithBank:
        customer.dueDiligence?.cashTransactions?.hasCashTransaction,
      transactionFrequency:
        customer.dueDiligence?.cashTransactions?.transactionFrequencyId ?? 0,
      transactionAmount:
        customer.dueDiligence?.cashTransactions?.averageTransactionAmount ?? 0,
      transactionCurrency:
        customer.dueDiligence?.cashTransactions?.currencyIds ?? [],
      bandId: customer.dueDiligence?.cashTransactions?.bandId ?? 0,
    },
    notes: {
      amlAuthorizationCommentsApproval:
        customer.notes?.amlAuthorizationCommentsApproval,
      userAmlAuth: customer.notes?.userAmlAuth,
      amlDateTimeAuth: customer.notes?.amlDateTimeAuth,
      retailKycUserNotes: customer.notes?.retailKycUserNotes,
      userRetailAuth: customer.notes?.userRetailAuth,
      retailDateTimeAuth: customer.notes?.retailDateTimeAuth,
    },
  };
};

export interface AuthorizationCrsCustomerDetailsDto {
  customerId: number;
  customerNumber: string;
  customerInformation: CustomerInformationDto;
  additionalInformation: AdditionalInformationDto;
  crs: CrsData;
  fatca: CrsFatcaData;
  isValid: boolean;
  notes: CrsNotesData;
  crsStatus: string;
  additionalAmlInfoDto: CrsAdditionalAmlInfoDto;
}

export interface CrsAuthorizationDetailsDto {
  customerInformation: CrsCustomerInformationData;
  additionalInformation: CrsAdditionalInformationData;
  notes: CrsNotesData;
  crs: CrsData;
  facta: CrsFatcaData;
  customerStatus: CrsCustomerStatus;
}
export interface CrsCustomerStatus {
  status: string;
  color: string;
}

export interface CrsCustomerInformationData {
  basicData: CrsBasicData;
  personalData: CrsPersonalInfoData;
  personalDocumentData: CrsPersonalDocumentData;
  addressData: CrsAddressData;
  contactData: CrsContactData;
}

export interface CrsBasicData {
  customerNumber: string;
  branch: string;
  customerSegment?: string;
}

export interface CrsAddressData {
  country: string;
  address: string;
  city: string;
}

export interface CrsPersonalInfoData {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  birthdate: string;
  nationality: string;
  cityOfResidence: string;
  countryOfBirth: string;
  birthplace: string;
  gender: string;
  maritalStatus: string;
  additionalLastName: string;
}

export interface CrsPersonalDocumentData {
  documentType: string;
  authorityIssue: string;
  documentNumber: string;
  personalNumber: string;
  issueDate: string;
  expiryDate: string;
}

export interface CrsContactData {
  mobileNumber: string;
  alternativeMobileNumber: string;
  prefix: string;
  workMobile: string;
  fax: string;
  email: string;
}

export interface CrsAdditionalInformationData {
  alternativeAddress: CrsAlternativeAddressData;
  employment: CrsEmploymentData;
  amlData: CrsAmlData;
}

export interface CrsAlternativeAddressData {
  residentialAddress: string;
  countryResidence: string;
  citizenship: string;
  cityResidence: string;
  stateOfTaxPayment: string;
}

export interface CrsEmploymentData {
  profession: string;
  ministry: string;
  institution: string;
}

export interface CrsAmlData {
  educationLevel: string;
  overallRiskRating: number;
  accountOfficer: string;
  naceCode: string;
  customerRisk: string;
  lob: string;
  prodLine: string;
  isPep: boolean;
  isFisa: boolean;
  crsStatus: string;
  riskRating: string;
}

export interface CrsData {
  crsDetails: CrsDetailsData;
  crsTaxInformation: CrsTaxInformationDto[];
}

export interface CrsDetailsData {
  crsSCDate: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  crsCureFlag: boolean;
  crsBusinessEntityStatus: string;
  crsActionExpireDate: string;
  crsAction: string;
  enhanceReviewDateCrs: string;
  crsStatus: string;
}

export interface CrsFatcaData {
  fatcaInformation: CrsFatcaInformationData;
}

export interface CrsFatcaInformationData {
  fatcaDocumentaryDate: string;
  fatcaDocumentaryDeadline: string;
  fatcaStatus: string;
  fatcaStatusDate: string;
  fatcaDocumentType: string;
  taxPayerCountry: string;
}

export interface CrsNotesData {
  amlAuthorizationCommentsApproval: string;
  userAmlAuth: string;
  amlDateTimeAuth: string;
  retailKycUserNotes: string;
  userRetailAuth: string;
  retailDateAuth: string;
}

export interface CrsAdditionalAmlInfoDto {
  lineOfBusiness: string;
  accountOfficerCode: string;
  accountOfficerName: string;
}

export const mapCrsDataFromAuthorizationCrsCustomerDetailsDto = (
  customer: AuthorizationCrsCustomerDetailsDto
): CrsAuthorizationDetailsDto => {
  return {
    customerStatus: {
      status: customer.customerInformation.customerStatus?.status ?? "",
      color: customer.customerInformation.customerStatus?.color ?? "",
    },
    customerInformation: {
      basicData: {
        customerNumber: customer.customerNumber,
        branch: customer.customerInformation.branchName ?? "",
        customerSegment: customer.customerInformation.customerSegment,
      },
      personalData: {
        firstName: customer.customerInformation.personalInfo.firstName,
        lastName: customer.customerInformation.personalInfo.lastName,
        fatherName: customer.customerInformation.personalInfo.fatherName,
        motherName: customer.customerInformation.personalInfo.motherName,
        birthdate: customer.customerInformation.personalInfo.birthdate,
        nationality: customer.customerInformation.personalInfo.nationality,
        cityOfResidence:
          customer.customerInformation.personalInfo.cityOfResidence ?? "",
        countryOfBirth:
          customer.customerInformation.personalInfo.countryOfBirth,
        birthplace: customer.customerInformation.personalInfo.birthplace,
        gender: customer.customerInformation.personalInfo.gender,
        maritalStatus: customer.customerInformation.personalInfo.martialStatus,
        additionalLastName:
          customer.customerInformation.personalInfo.additionalLastName ?? "",
      },
      personalDocumentData: {
        documentType: customer.customerInformation.document.type,
        authorityIssue: customer.customerInformation.document.issuer,
        documentNumber: customer.customerInformation.document.number,
        personalNumber: customer.customerInformation.document.ssn,
        issueDate: customer.customerInformation.document.issueDate,
        expiryDate: customer.customerInformation.document.expiryDate,
      },
      addressData: {
        country: customer.customerInformation.address.country,
        address: customer.customerInformation.address.address,
        city: customer.customerInformation.address.city,
      },
      contactData: {
        mobileNumber: customer.customerInformation.contact.mobileNumber ?? "",
        alternativeMobileNumber:
          customer.customerInformation.contact.alternativeMobileNumber ?? "",
        prefix: customer.customerInformation.contact.prefix ?? "",
        workMobile: "",
        fax: "",
        email: customer.customerInformation.contact.email,
      },
    },
    additionalInformation: {
      alternativeAddress: {
        residentialAddress:
          customer.additionalInformation.alternativeAddress
            .residentialAddress ?? "",
        countryResidence:
          customer.additionalInformation.alternativeAddress.cityResidence ?? "",
        citizenship:
          customer.additionalInformation.alternativeAddress.citizenship ?? "",
        cityResidence:
          customer.additionalInformation.alternativeAddress.cityResidence ?? "",
        stateOfTaxPayment:
          customer.additionalInformation.alternativeAddress.stateOfTaxPayment ??
          "",
      },
      employment: {
        profession:
          customer.additionalInformation.employment.profession.profession ?? "",
        ministry:
          customer.additionalInformation?.employment?.ministry.ministry ?? "",
        institution:
          customer.additionalInformation?.employment?.institution.dicastery ??
          "",
      },
      amlData: {
        educationLevel:
          customer.additionalInformation.amlData.educationLevel ?? "",
        overallRiskRating:
          customer.additionalInformation.amlData.overallRiskRating,
        accountOfficer: customer.additionalAmlInfoDto.accountOfficerName,
        naceCode: customer.additionalInformation.addedInfo.naceCode ?? "",
        customerRisk:
          customer.additionalInformation.addedInfo.custRiskClassification ?? "",
        lob: customer.additionalAmlInfoDto.lineOfBusiness,
        prodLine: customer.additionalInformation?.addedInfo?.planProduct ?? "",
        isPep: customer.additionalInformation?.addedInfo.isPep ?? false,
        isFisa: customer.additionalInformation?.addedInfo.isFisa ?? false,
        crsStatus: customer.crsStatus ?? "",
        riskRating: customer.additionalInformation?.amlData.riskRating ?? "",
      },
    },
    notes: {
      amlAuthorizationCommentsApproval:
        customer.notes.amlAuthorizationCommentsApproval,
      userAmlAuth: customer.notes.userAmlAuth,
      amlDateTimeAuth: customer.notes.amlDateTimeAuth,
      retailKycUserNotes: customer.notes.retailKycUserNotes,
      userRetailAuth: customer.notes.userRetailAuth,
      retailDateAuth: customer.notes.retailDateAuth,
    },
    crs: {
      crsDetails: {
        crsSCDate: customer.crs.crsDetails.crsSCDate,
        crsCureFlag: customer.crs.crsDetails.crsCureFlag,
        crsBusinessEntityStatus:
          customer.crs.crsDetails.crsBusinessEntityStatus,
        crsActionExpireDate: customer.crs.crsDetails.crsActionExpireDate,
        crsAction: customer.crs.crsDetails.crsAction,
        enhanceReviewDateCrs: customer.crs.crsDetails.enhanceReviewDateCrs,
        crsStatus: customer.crs.crsDetails.crsStatus,
      },
      crsTaxInformation: customer.crs.crsTaxInformation,
    },
    facta: {
      fatcaInformation: {
        fatcaDocumentaryDate:
          customer.fatca.fatcaInformation.fatcaDocumentaryDate,
        fatcaDocumentaryDeadline:
          customer.fatca.fatcaInformation.fatcaDocumentaryDeadline,
        fatcaStatus: customer.fatca.fatcaInformation.fatcaStatus,
        fatcaStatusDate: customer.fatca.fatcaInformation.fatcaStatusDate,
        fatcaDocumentType: customer.fatca.fatcaInformation.fatcaDocumentType,
        taxPayerCountry: customer.fatca.fatcaInformation.taxPayerCountry,
      },
    },
  };
};
