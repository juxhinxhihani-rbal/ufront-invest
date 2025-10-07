import { CountryCallingCode, NationalNumber } from "libphonenumber-js";

export interface CreateWalkInCustomerResponse {
  partyId?: number;
  message?: string;
  status: string;
}

export enum CreateWalkInCustomerStatus {
  Success = "Success",
  PartiallyCreated = "PartiallyCreated",
  Failure = "Failure",
}

export interface WalkInCustomerResponseDto {
  idParty: number;
  personalInformation: WalkInCustomerPersonalInformationDto;
  additionalInformation: WalkInCustomerAdditionalInformationDto;
  addressInformation: WalkInCustomerAddressDto;
  contactData: WalkInCustomerContactData;
  amlInformation: WalkInCustomerAmlDto;
  documentData: DocumentDataDto;
}

export interface WalkInCustomerResponseDto {
  idParty: number;
  personalInformation: WalkInCustomerPersonalInformationDto;
  additionalInformation: WalkInCustomerAdditionalInformationDto;
  addressInformation: WalkInCustomerAddressDto;
  contactData: WalkInCustomerContactData;
  amlInformation: WalkInCustomerAmlDto;
  documentData: DocumentDataDto;
}

export interface WalkInCustomerPersonalInformationDto {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  birthdate: string;
  countryOfResidenceId: number;
  countryOfResidence: string;
  countryOfBirthId: number;
  countryOfBirth: string;
  cityOfResidence: string;
  birthplace: string;
  birthplaceId: number;
  nationality: string;
  nationalityId: number;
  genderId: number;
  gender: string;
  martialStatusId: number;
  martialStatus: string;
  maidenName: string;
  userIdCreated: number;
  userCreated: string;
  userIdModified: number;
  userModified: string;
  openDate: string;
  lastModifiedDate: string;
}

export interface WalkInCustomerAdditionalInformationDto {
  fatcaInformation: WalkInCustomerFatcaInformationDto;
  alternativeAddress: WalkInCustomerAlternativeAddressDto;
  employmentData: EmploymentDataDto;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  marketableCustomer: boolean;
  custRiskClassificationId: number;
  custRiskClassification: string;
  naceCodeId: number;
  naceCode: string;
  amlExemptionId: number;
  amlExemption: string;
  isFisa: boolean;
  isPep: boolean;
}

export interface WalkInCustomerFatcaInformationDto {
  documentaryDeadline: string;
  documentaryDate: string;
  fatcaStatus: string;
  fatcaStatusId: number;
  statusDate: string;
}

export interface WalkInCustomerAlternativeAddressDto {
  residentialAddress: string;
  countryResidenceId: number;
  countryResidence: string;
  cityResidenceId: number;
  cityResidence: string;
  citizenshipId: number;
  citizenship: string;
  stateOfTaxPaymentId: number;
  stateOfTaxPayment: string;
}

export interface EmploymentDataDto {
  professionId: number;
  profession: string;
  ministryId: number;
  ministry: string;
  dicasteryId: number;
  dicastery: string;
}

export interface WalkInCustomerAddressDto {
  countryId: number;
  country: string;
  address: string;
  cityId: number;
  city: string;
}

export interface WalkInCustomerContactData {
  mobileNumber: NationalNumber;
  prefixId: number;
  prefix: CountryCallingCode;
  alternativeMobileNumber: string;
  workMobile: string;
  email: string;
  isEmailValidated: boolean;
  isPhoneVerified: boolean;
}

export interface WalkInCustomerAmlDto {
  educationLevelId: number;
  educationLevel: string;
  overallRiskRating: number;
  deathDate: string;
}

export interface DocumentDataDto {
  typeId: number;
  type: string;
  issuerId: number;
  issuer: string;
  number: string;
  ssn: string;
  issueDate: string;
  expiryDate: string;
  isSsnNotRegularFormat: boolean | undefined;
}

export interface WalkInCustomerDto {
  idParty: number;
  basicInformation: BasicInformationDto;
  additionalInformation: WalkInCustomerAdditionalInformationDto;
}

export interface BasicInformationDto {
  personalInformation: WalkInCustomerPersonalInformationDto;
  addressInformation: WalkInCustomerAddressDto;
  contactData: WalkInCustomerContactData;
  amlInformation: WalkInCustomerAmlDto;
  documentData: DocumentDataDto;
}

export interface CreateWalkInCustomerDto {
  personalInformation: {
    firstName: string | undefined;
    lastName: string | undefined;
    fatherName: string | undefined;
    motherName: string | undefined;
    birthdate: string | undefined;
    countryOfBirthId: number;
    birthplace: string | undefined;
    nationalityId: number | undefined;
    genderId: number | undefined;
    martialStatusId: number;
    maidenName: string | undefined;
  };
  additionalInformation: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    marketableCustomer: boolean | undefined;
    fatcaInformation: {
      documentaryDeadline: string | undefined;
      documentaryDate: string | undefined;
      fatcaStatus: string | undefined;
      statusDate: string | undefined;
    };
    adittionalAdress: {
      residentialAddress: string | undefined;
      countryResidenceId: number | undefined;
      citizenshipId: number | undefined;
      cityResidenceId: number | undefined;
      stateOfTaxPaymentId: number | undefined;
    };
    employment: {
      professionId: number | undefined;
      ministryId: number | undefined;
      dicasteryId: number | undefined;
    };
  };
  addressInformation: {
    countryId: number | undefined;
    address: string | undefined;
    cityId: number | undefined;
  };
  contactData: {
    mobileNumber: string | undefined;
    alternativeMobileNumber: string | undefined;
    email: string | undefined;
    isEmailValidated: boolean | undefined;
  };
  amlInformation: {
    educationLevelId: number | undefined;
    overallRiskRating: number | undefined;
    deathDate: string | undefined;
  };
  documentData: {
    typeId: number | undefined;
    issuerId: number | undefined;
    number: string | undefined;
    ssn: string | undefined;
    issueDate: string | undefined;
    expiryDate: string | undefined;
    isSsnNotRegularFormat: boolean | undefined;
  };
}
