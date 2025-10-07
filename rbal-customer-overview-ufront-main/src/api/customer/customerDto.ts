import { format } from "date-fns";
import { USA_TAX_RESIDENCE_INDEX } from "~/components/CustomerModificationForm/components/CRS/components/EditTaxInformations/EditTaxInformationTable";
import { Country } from "~/modules/EditCustomer/types";
import { WalkInCustomerDto } from "../walkInCustomer/walkInCustomerApi.types";
import { PremiumSegments } from "~/modules/ResegmentCustomer/types";
import {
  CustomerUpdateDto,
  CustomerListingItem,
  CustomerListingResponse,
  CustomerDto,
  AccountRightsModel,
  CreateCustomerDto,
  ConsentStatus,
  UnformattedCustomerAuthorizedPersonsResponse,
  CustomerAuthorizedPersonsResponse,
} from "./customerApi.types";
import { PremiumServiceIds } from "./customerApi.types";

export const toCustomerListingItem = (
  data: CustomerListingResponse[]
): CustomerListingItem[] =>
  data.map((item) => ({
    ...item,
    id: item.idParty,
    name: item.fullName,
    nipt: item.phoneNumber,
    status: item.customerStatus,
    sectorType: item.customerSegment,
    birthDate: item.birthDate,
    birthPlace: item.birthPlace,
    branchCode: item.branchCode,
    customerNumber: item.customerNumber,
    customerSegment: item.customerSegment,
    documentNumber: item.documentNumber,
    lastSavedDate: item.lastSavedDate,
    lukaSignatureStatus: item.lukaSignatureStatus,
    personalNumber: item.personalNumber,
    screenDate: item.screenDate,
    isNrpClosedLongTerm: item.isNrpClosedLongTerm,
  }));

export const toCustomerItem = (data: CustomerDto): CustomerDto => {
  return {
    ...data,
    customerInformation: {
      ...data.customerInformation,
      premiumData: data.customerInformation.premiumData ?? {
        accountOfficerId: null,
        premiumService: null,
        segmentCriteriaId: null,
      },
      auditInfo: data.customerInformation.auditInfo ?? {},
      address: data.customerInformation.address ?? {},
      personalInfo: {
        ...data.customerInformation.personalInfo,
        isRial: data.customerInformation.isRial,
        birthplace: data.customerInformation.personalInfo.birthplace,
        birthdate: data.customerInformation.personalInfo.birthdate
          ? format(
              new Date(data.customerInformation.personalInfo.birthdate),
              "yyyy-MM-dd"
            )
          : "",
      },
      document: {
        ...data.customerInformation.document,
        issueDate: data.customerInformation.document.issueDate
          ? format(
              new Date(data.customerInformation.document.issueDate),
              "yyyy-MM-dd"
            )
          : "",
        expiryDate: data.customerInformation.document.expiryDate
          ? format(
              new Date(data.customerInformation.document.expiryDate),
              "yyyy-MM-dd"
            )
          : "",
      },
      serviceInformation: {
        premiumServiceId:
          data.customerInformation?.premiumData?.premiumServiceId,
        premiumService:
          data.customerInformation?.premiumData?.premiumService ?? "",
      },
    },
    additionalInformation: {
      employment: data.additionalInformation?.employment ?? {},
      amlData: data.additionalInformation?.amlData ?? {},
      boaData: data.additionalInformation?.boaData ?? {},
      alternativeAddress: data.additionalInformation?.alternativeAddress ?? {},
      choosingReason: data.additionalInformation?.choosingReason ?? {},
      addedInfo: data.additionalInformation?.addedInfo ?? {},
      marketableCustomer: data.additionalInformation?.marketableCustomer ?? {},
      cbConsent: data.additionalInformation?.cbConsent ?? {},
    },
    dueDiligence: {
      ...data.dueDiligence,
      employment: data.dueDiligence.employment ?? {},
      sourceOfIncome: data.dueDiligence.sourceOfIncome ?? {},
      bankingProducts: data.dueDiligence.bankingProducts ?? {},
      cashTransactions: data.dueDiligence.cashTransactions ?? {},
      reasonOfUse: data.dueDiligence.reasonOfUse ?? {},
    },
    crs: {
      crsDetails: {
        ...data.crs.crsDetails,
        crsSCDate: data.crs.crsDetails.crsSCDate
          ? format(new Date(data.crs.crsDetails.crsSCDate), "yyyy-MM-dd")
          : "",
        crsActionExpireDate: data.crs.crsDetails.crsActionExpireDate
          ? format(
              new Date(data.crs.crsDetails.crsActionExpireDate),
              "yyyy-MM-dd"
            )
          : "",
        enhanceReviewDateCrs: data.crs.crsDetails.enhanceReviewDateCrs
          ? format(
              new Date(data.crs.crsDetails.enhanceReviewDateCrs),
              "yyyy-MM-dd"
            )
          : "",
      },
      crsTaxInformation: data.crs.crsTaxInformation,
    },
    fatca: {
      fatcaInformation: {
        ...data.fatca.fatcaInformation,
        statusDate: data.fatca.fatcaInformation?.statusDate
          ? format(
              new Date(data.fatca.fatcaInformation.statusDate),
              "yyyy-MM-dd"
            )
          : "",
        documentaryDeadline: data.fatca.fatcaInformation?.documentaryDeadline
          ? format(
              new Date(data.fatca.fatcaInformation.documentaryDeadline),
              "yyyy-MM-dd"
            )
          : "",
        documentaryDate: data.fatca.fatcaInformation?.documentaryDate
          ? format(
              new Date(data.fatca.fatcaInformation.documentaryDate),
              "yyyy-MM-dd"
            )
          : "",
      },
    },
  };
};

export const mapFormToCustomerModificationDto = (
  values: CustomerDto,
  customerSegmentId?: number | undefined
): CustomerUpdateDto => {
  const isAlbanianNationality =
    values.customerInformation?.personalInfo.nationalityId == Country.Albania;

  return {
    idParty: values.idParty,
    customerSegmentId: customerSegmentId,

    personalInfo: {
      firstName: values.customerInformation.personalInfo.firstName,
      lastName: values.customerInformation.personalInfo.lastName,
      fatherName: values.customerInformation.personalInfo.fatherName,
      motherName: values.customerInformation.personalInfo.motherName,
      birthdate: values.customerInformation.personalInfo.birthdate,
      countryOfBirthId:
        values.customerInformation.personalInfo.countryOfBirthId,
      birthplace: values.customerInformation.personalInfo.birthplace,
      nationalityId: values.customerInformation.personalInfo.nationalityId,
      genderId: values.customerInformation.personalInfo.genderId,
      martialStatusId: values.customerInformation.personalInfo.martialStatusId,
      additionalLastName:
        values.customerInformation.personalInfo.additionalLastName,
      isSalaryReceivedAtRbal:
        values.customerInformation.personalInfo.isSalaryReceivedAtRbal,
      isRial: values.customerInformation.personalInfo.isRial,
    },
    document: {
      ssn: values.customerInformation.document.ssn,
      typeId: values.customerInformation.document.typeId,
      issuerId: values.customerInformation.document.issuerId,
      number: values.customerInformation.document.number,
      issueDate: values.customerInformation.document.issueDate,
      expiryDate: values.customerInformation.document.expiryDate,
      isSsnNotRegularFormat: isAlbanianNationality
        ? Boolean(values.customerInformation?.document?.isSsnNotRegularFormat)
        : false,
    },
    contact: {
      mobileNumber: values.customerInformation.contact.mobileNumber,
      alternativeMobileNumber:
        values.customerInformation.contact.alternativeMobileNumber,
      prefix: values.customerInformation.contact.prefix,
      email: values.customerInformation.contact.email,
      isEmailVerified: Boolean(
        values.customerInformation.contact.isEmailValidated
      ),
      isPhoneNumberVerified: Boolean(
        values.customerInformation.contact.isPhoneNumberVerified
      ),
    },
    premiumData: values.customerInformation.premiumData
      ? {
          accountOfficerId:
            values.customerInformation.premiumData.accountOfficerId,
          segmentCriteriaId:
            values.customerInformation.premiumData.segmentCriteriaId,
          premiumServiceId:
            values.customerInformation.serviceInformation?.premiumServiceId,
        }
      : undefined,
    address: {
      address: values.customerInformation.address.address,
      countryId: values.customerInformation.address.countryId,
      cityId: values.customerInformation.address.cityId,
      zipCode: values.customerInformation.address.zipCode,
    },
    individualInformation: {
      isWeb: values.digitalBanking?.individualInformation?.isWeb,
      isMobile: values.digitalBanking?.individualInformation?.isMobile,
      profileId: values.digitalBanking?.individualInformation?.profileId,
      packagesId: values.digitalBanking?.individualInformation?.packageId,
      securityElementId:
        values.digitalBanking?.individualInformation?.securityElementId,
    },
    businessInformation: {
      isWeb: values.digitalBanking?.businessInformation?.isWeb,
      isMobile: values.digitalBanking?.businessInformation?.isMobile,
    },
    consents: {
      cbChecked: values.additionalInformation?.cbConsent.cbConsentAgreed,
      marketableChecked:
        values.additionalInformation?.marketableCustomer.marketableCustomer,
    },
    fatca: {
      fatcaInformation: {
        documentType: values.fatca.fatcaInformation?.documentType,
        statusDate: values.fatca.fatcaInformation?.statusDate,
        status: values.fatca.fatcaInformation?.status,
        documentaryDeadline: values.fatca.fatcaInformation?.documentaryDeadline,
        documentaryDate: values.fatca.fatcaInformation?.documentaryDate,
      },
    },
    dueDiligence: {
      employment: {
        employmentTypeId: values.dueDiligence.employment.employmentTypeId,
        clientHasManagerialPosition: Boolean(
          values.dueDiligence.employment.clientHasManagerialPosition
        ),
        specify: values.dueDiligence.employment.specify,
      },
      sourceOfIncome: {
        sourceFundTypeIds: values.dueDiligence.sourceOfIncome.sourceFundTypeIds,
      },
      bankingProducts: {
        purposeOfBankRelationTypeIds:
          values.dueDiligence.bankingProducts.purposeOfBankRelationTypeIds,
      },
      cashTransactions: {
        hasCashTransaction: Boolean(
          values.dueDiligence.cashTransactions.hasCashTransaction
        ),
        transactionFrequencyId:
          values.dueDiligence.cashTransactions.transactionFrequencyId,
        averageTransactionAmount:
          values.dueDiligence.cashTransactions.averageTransactionAmount,
        currencyIds: values.dueDiligence.cashTransactions.currencyIds,
        bandId: values.dueDiligence.cashTransactions.bandId,
      },
      reasonOfUse: {
        volumeOfUse: values.dueDiligence.reasonOfUse.volumeOfUse,
      },
    },
    employment: {
      professionId:
        values.additionalInformation?.employment.profession.professionId,
      dicasteryId:
        values.additionalInformation?.employment.institution.dicasteryId,
    },
    amlData: {
      educationLevelId: values.additionalInformation?.amlData.educationLevelId,
      overallRiskRating:
        values.additionalInformation?.amlData.overallRiskRating,
      deathDate: values.additionalInformation?.amlData.deathDate,
    },
    boaData: {
      boaSegmentId: values.additionalInformation?.boaData.boaSegmentId,
    },
    alternativeAddress: {
      residentialAddress:
        values.additionalInformation?.alternativeAddress.residentialAddress,
      countryResidenceId:
        values.additionalInformation?.alternativeAddress.countryResidenceId,
      citizenshipId:
        values.additionalInformation?.alternativeAddress.citizenshipId,
      cityResidenceId:
        values.additionalInformation?.alternativeAddress.cityResidenceId,
      stateOfTaxPaymentId:
        values.additionalInformation?.alternativeAddress.stateOfTaxPaymentId,
    },
    choosingReason: {
      choosingReasonId:
        values.additionalInformation?.choosingReason.choosingReasonId,
    },
    addedInfo: {
      planProductId: values.additionalInformation?.addedInfo.planProductId,
      customerRiskClassificationId:
        values.additionalInformation?.addedInfo.custRiskClassificationId,
      naceCodeId: values.additionalInformation?.addedInfo.naceCodeId,
      amlExemptionId: values.additionalInformation?.addedInfo.amlExemptionId,
      isPep: Boolean(values.additionalInformation?.addedInfo.isPep),
      isFisa: Boolean(values.additionalInformation?.addedInfo.isFisa),
    },
    crs: values.crs.crsTaxInformation?.map((taxInformation, index) => ({
      idCountry: taxInformation.countryId,
      idCrsTaxResidence: taxInformation.crsTaxResidenceId,
      taxResidenceIndex:
        taxInformation.countryId == Country.Usa
          ? USA_TAX_RESIDENCE_INDEX
          : index + 1,
      residenceTin: taxInformation.residenceTin,
    })),
    crsDetails: {
      crsSCDate: values.crs.crsDetails.crsSCDate,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      crsCureFlag: Boolean(values.crs.crsDetails.crsCureFlag),
      crsActionExpireDate: values.crs.crsDetails.crsActionExpireDate,
      enhanceReviewDateCrs: values.crs.crsDetails.enhanceReviewDateCrs,
    },
  };
};

export const mapCreateCustomerFormToCreateCustomerDTO = (
  data: CustomerDto
): CreateCustomerDto => {
  const isAlbanianNationality =
    data.customerInformation?.personalInfo.nationalityId == Country.Albania;
  const isPremiumService =
    PremiumSegments[
      data.customerInformation?.customerSegmentId as PremiumSegments
    ] !== undefined;

  return {
    mainSegmentId: data.customerInformation?.mainSegmentId,
    customerSegmentId: data.customerInformation?.customerSegmentId,
    personalInfo: {
      firstName: data.customerInformation?.personalInfo?.firstName,
      lastName: data.customerInformation?.personalInfo?.lastName,
      fatherName: data.customerInformation?.personalInfo?.fatherName,
      motherName: data.customerInformation?.personalInfo?.motherName,
      birthdate: data.customerInformation?.personalInfo?.birthdate,
      countryOfBirthId:
        data.customerInformation?.personalInfo?.countryOfBirthId,
      birthplace: data.customerInformation?.personalInfo?.birthplace,
      genderId: data.customerInformation?.personalInfo?.genderId,
      martialStatusId: data.customerInformation?.personalInfo?.martialStatusId,
      additionalLastName:
        data.customerInformation?.personalInfo?.additionalLastName,
      isSalaryReceivedAtRbal:
        data.customerInformation?.personalInfo?.isSalaryReceivedAtRbal,
      nationalityId: data.customerInformation?.personalInfo?.nationalityId,
      isRial: data.customerInformation?.personalInfo?.isRial,
    },
    document: {
      ssn: data.customerInformation?.document?.ssn,
      typeId: data.customerInformation?.document?.typeId,
      issuerId: data.customerInformation?.document?.issuerId,
      issueDate: data.customerInformation?.document?.issueDate,
      number: data.customerInformation?.document?.number,
      expiryDate: data.customerInformation?.document?.expiryDate,
      isSsnNotRegularFormat: isAlbanianNationality
        ? Boolean(data.customerInformation?.document?.isSsnNotRegularFormat)
        : false,
    },
    contact: {
      mobileNumber: data.customerInformation?.contact?.mobileNumber,
      alternativeMobileNumber:
        data.customerInformation?.contact?.alternativeMobileNumber,
      prefix: data.customerInformation?.contact?.prefix,
      email: data.customerInformation?.contact?.email,
      isPhoneNumberVerified: Boolean(
        data.customerInformation?.contact?.isPhoneNumberVerified
      ),
      isEmailVerified: Boolean(
        data.customerInformation?.contact?.isEmailValidated
      ),
    },
    premiumData: data.customerInformation?.premiumData
      ? {
          accountOfficerId:
            data.customerInformation?.premiumData?.accountOfficerId,
          segmentCriteriaId:
            data.customerInformation?.premiumData?.segmentCriteriaId,
          premiumServiceId:
            data.customerInformation?.serviceInformation?.premiumServiceId ??
            (isPremiumService
              ? PremiumServiceIds.Branch
              : PremiumServiceIds.DegeBranch),
        }
      : undefined,
    address: {
      address: data.customerInformation?.address?.address,
      countryId: data.customerInformation?.address?.countryId,
      cityId: data.customerInformation?.address?.cityId,
      zipCode: data.customerInformation?.address?.zipCode,
    },
    individualInformation: {
      isWeb: data.digitalBanking?.individualInformation?.isWeb,
      isMobile: data.digitalBanking?.individualInformation?.isMobile,
      profileId: data.digitalBanking?.individualInformation?.profileId,
      packagesId: data.digitalBanking?.individualInformation?.packageId,
      securityElementId:
        data.digitalBanking?.individualInformation?.securityElementId,
    },
    businessInformation: {
      isWeb: data.digitalBanking?.businessInformation?.isWeb,
      isMobile: data.digitalBanking?.businessInformation?.isMobile,
    },
    employment: {
      professionId:
        data.additionalInformation?.employment?.profession?.professionId,
      dicasteryId:
        data.additionalInformation?.employment?.institution?.dicasteryId,
      // ministryId: data.additionalInformation?.employment?.ministry?.ministryId,
    },
    amlData: {
      educationLevelId: data.additionalInformation?.amlData?.educationLevelId,
      overallRiskRating: data.additionalInformation?.amlData?.overallRiskRating,
      dateOfDeath: data.additionalInformation?.amlData?.deathDate,
    },
    boaData: {
      boaSegmentId: data.additionalInformation?.boaData.boaSegmentId,
    },
    alternativeAddress: {
      currentAddress:
        data.additionalInformation?.alternativeAddress?.residentialAddress,
      countryOfResidenceId:
        data.additionalInformation?.alternativeAddress?.countryResidenceId,
      nationalityId:
        data.additionalInformation?.alternativeAddress?.citizenshipId,
      cityOfResidenceId:
        data.additionalInformation?.alternativeAddress?.cityResidenceId,
      countryOfTaxPaymentId:
        data.additionalInformation?.alternativeAddress?.stateOfTaxPaymentId,
      whyRaiffeisenId:
        data.additionalInformation?.choosingReason?.choosingReasonId,
    },
    addedInfo: {
      planProductId: data.additionalInformation?.addedInfo?.planProductId,
      custRiskClassificationId:
        data.additionalInformation?.addedInfo?.custRiskClassificationId,
      naceCodeId: data.additionalInformation?.addedInfo?.naceCodeId,
      amlExemptionId: data.additionalInformation?.addedInfo?.amlExemptionId,
    },
    consents: {
      cbChecked: data.additionalInformation?.cbConsent?.cbConsentAgreed,
      marketableChecked:
        data.additionalInformation?.marketableCustomer?.marketableCustomer,
    },
    crs:
      data.crs?.crsTaxInformation.map((crsItem, index) => ({
        idCountry: crsItem.countryId,
        idCrsTaxResidence: crsItem.crsTaxResidenceId,
        taxResidenceIndex:
          crsItem.countryId == Country.Usa
            ? USA_TAX_RESIDENCE_INDEX
            : index + 1,
        residenceTin: crsItem.residenceTin,
      })) || [],
    crsDetails: {
      crsSCDate: data.crs?.crsDetails.crsSCDate,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      crsCureFlag: Boolean(data.crs?.crsDetails.crsCureFlag),
      crsActionExpireDate: data.crs?.crsDetails.crsActionExpireDate,
      enhanceReviewDateCrs: data.crs.crsDetails.enhanceReviewDateCrs,
    },
    fatca: {
      fatcaInformation: {
        status: data.fatca?.fatcaInformation?.status,
        statusDate: data.fatca?.fatcaInformation?.statusDate,
        documentType: data.fatca?.fatcaInformation?.documentType,
        documentaryDeadline: data.fatca?.fatcaInformation?.documentaryDeadline,
        documentaryDate: data.fatca?.fatcaInformation?.documentaryDate,
      },
    },
    dueDiligence: {
      employment: {
        employmentTypeId: data?.dueDiligence?.employment?.employmentTypeId,
        clientHasManagerialPosition:
          data?.dueDiligence?.employment?.clientHasManagerialPosition,
        specify: data?.dueDiligence?.employment?.specify,
      },
      sourceOfIncome: {
        sourceFundTypeIds: data?.dueDiligence.sourceOfIncome.sourceFundTypeIds,
      },
      bankingProducts: {
        purposeOfBankRelationTypeIds:
          data?.dueDiligence.bankingProducts.purposeOfBankRelationTypeIds,
      },
      cashTransactions: {
        hasCashTransaction: Boolean(
          data?.dueDiligence.cashTransactions.hasCashTransaction
        ),
        transactionFrequencyId:
          data?.dueDiligence.cashTransactions.transactionFrequencyId,
        averageTransactionAmount:
          data?.dueDiligence.cashTransactions.averageTransactionAmount,
        currencyIds: data?.dueDiligence.cashTransactions.currencyIds,
        bandId: data?.dueDiligence?.cashTransactions?.bandId,
      },
      reasonOfUse: {
        volumeOfUse: data?.dueDiligence.reasonOfUse.volumeOfUse,
      },
    },
    choosingReasonId:
      data.additionalInformation?.choosingReason?.choosingReasonId,
  };
};

export const toAuthorizedPersonRights = (values: AccountRightsModel) => {
  const result = [];

  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      result.push({
        productId: Number(key),
        rights: values[key],
      });
    }
  }

  return result;
};

export const mapAuthorizedPersonsDto = (
  authorizedPersons: UnformattedCustomerAuthorizedPersonsResponse[]
): CustomerAuthorizedPersonsResponse[] => {
  return authorizedPersons.map((authorizedPerson) => ({
    idParty: authorizedPerson.idParty,
    customerNumber: authorizedPerson.customerNumber,
    reportName: authorizedPerson.reportName,
    birthdate: authorizedPerson.birthdate,
    documentNumber: authorizedPerson.documentNumber,
    mobileNumber: authorizedPerson.mobileNumber,
    branchUser: authorizedPerson.branchUser,
    authorizedDate: authorizedPerson.authorizedDate,
    isActive: authorizedPerson.isActive,
    crs: authorizedPerson.crs,
    authorizedPersonSignature: authorizedPerson.authorizedPersonSignature,
    customerInformation: {
      personalInfo: {
        countryOfResidenceId: authorizedPerson.countryOfResidenceId,
        nationalityId: authorizedPerson.nationalityId,
        countryOfBirthId: authorizedPerson.countryOfBirthId,
      },
      document: {
        typeId: authorizedPerson.typeId,
      },
      address: {
        countryId: authorizedPerson.countryId,
      },
      contact: {
        countryCodeMobile: authorizedPerson.countryCodeMobile,
      },
    },
  }));
};

export function mapWalkInCustomerToCustomer(
  walkInCustomer: WalkInCustomerDto
): CustomerDto {
  const { idParty, basicInformation, additionalInformation } = walkInCustomer;

  return {
    idParty,
    customerNumber: "",
    customerInformation: {
      mainSegmentId: undefined,
      mainSegment: "",
      midasStatus: "",
      customerSegmentId: undefined,
      customerSegment: "",
      customerStatus: {},
      branchCode: "",
      reportName: "",
      auditInfo: {
        createdBy: basicInformation.personalInformation.userCreated,
        createdDate: basicInformation.personalInformation.openDate,
        modifiedBy: basicInformation.personalInformation.userModified,
        modifiedDate: basicInformation.personalInformation.lastModifiedDate,
        authorizedBy: undefined,
        authorizationDate: undefined,
      },
      address: {
        countryId: basicInformation.addressInformation.countryId,
        country: basicInformation.addressInformation.country,
        address: basicInformation.addressInformation.address,
        cityId: basicInformation.addressInformation.cityId,
        city: basicInformation.addressInformation.city,
        zipCode: "",
      },
      personalInfo: {
        firstName: basicInformation.personalInformation.firstName,
        lastName: basicInformation.personalInformation.lastName,
        fatherName: basicInformation.personalInformation.fatherName,
        motherName: basicInformation.personalInformation.motherName,
        birthdate: basicInformation.personalInformation.birthdate,
        birthplace: basicInformation.personalInformation.birthplace,
        nationality: basicInformation.personalInformation.nationality,
        nationalityId: basicInformation.personalInformation.nationalityId,
        countryOfBirthId: basicInformation.personalInformation.countryOfBirthId,
        countryOfBirth: basicInformation.personalInformation.countryOfBirth,
        genderId: basicInformation.personalInformation.genderId,
        gender: basicInformation.personalInformation.gender,
        martialStatusId:
          basicInformation.personalInformation.martialStatusId ?? undefined,
        martialStatus: basicInformation.personalInformation.martialStatus,
        additionalLastName: basicInformation.personalInformation.maidenName,
        isSalaryReceivedAtRbal: undefined,
        countryOfResidenceId:
          basicInformation.personalInformation.countryOfResidenceId,
        countryOfResidence:
          basicInformation.personalInformation.countryOfResidence,
        cityOfResidence: basicInformation.personalInformation.cityOfResidence,
      },
      document: {
        typeId: basicInformation.documentData.typeId,
        type: basicInformation.documentData.type,
        issuerId: basicInformation.documentData.issuerId,
        issuer: basicInformation.documentData.issuer,
        number: basicInformation.documentData.number,
        ssn: basicInformation.documentData.ssn,
        issueDate: basicInformation.documentData.issueDate,
        expiryDate: basicInformation.documentData.expiryDate,
        isSsnNotRegularFormat:
          basicInformation.documentData.isSsnNotRegularFormat,
      },
      contact: {
        mobileNumber: basicInformation.contactData.mobileNumber,
        alternativeMobileNumber:
          basicInformation.contactData.alternativeMobileNumber,
        prefixId: basicInformation.contactData.prefixId,
        prefix: basicInformation.contactData.prefix,
        email: basicInformation.contactData.email,
        countryCodeMobile: "",
        isEmailValidated: basicInformation.contactData.isEmailValidated,
        isPhoneNumberVerified: basicInformation.contactData.isPhoneVerified,
      },
      premiumData: {
        accountOfficerId: undefined,
        accountOfficerName: "",
        segmentCriteriaId: undefined,
        segmentCriteriaName: "",
        premiumService: undefined,
        premiumServiceId: undefined,
      },
      isChargeAccountNeeded: undefined,
      isNrpClosedLongTerm: undefined,
    },
    additionalInformation: {
      employment: {
        profession: {
          professionId: additionalInformation.employmentData.professionId,
          profession: additionalInformation.employmentData.profession,
        },
        ministry: {
          ministryId: additionalInformation.employmentData.ministryId,
          ministry: additionalInformation.employmentData.ministry,
        },
        institution: {
          dicasteryId: additionalInformation.employmentData.dicasteryId,
          dicastery: additionalInformation.employmentData.dicastery,
        },
      },
      amlData: {
        educationLevelId: basicInformation.amlInformation.educationLevelId,
        educationLevel: basicInformation.amlInformation.educationLevel,
        overallRiskRating: basicInformation.amlInformation.overallRiskRating,
        deathDate: basicInformation.amlInformation.deathDate,
        riskRating: undefined,
        documentStatus: undefined,
      },
      boaData: {
        boaSegmentId: undefined,
        boaSegment: undefined,
        description: undefined,
      },
      alternativeAddress: {
        residentialAddress:
          additionalInformation.alternativeAddress.residentialAddress,
        countryResidenceId:
          additionalInformation.alternativeAddress.countryResidenceId,
        countryResidence:
          additionalInformation.alternativeAddress.countryResidence,
        citizenshipId: additionalInformation.alternativeAddress.citizenshipId,
        citizenship: additionalInformation.alternativeAddress.citizenship,
        cityResidenceId:
          additionalInformation.alternativeAddress.cityResidenceId,
        cityResidence: additionalInformation.alternativeAddress.cityResidence,
        stateOfTaxPaymentId:
          additionalInformation.alternativeAddress.stateOfTaxPaymentId,
        stateOfTaxPayment:
          additionalInformation.alternativeAddress.stateOfTaxPayment,
      },
      choosingReason: {
        choosingReasonId: undefined,
        choosingReasonName: undefined,
      },
      addedInfo: {
        planProductId: undefined,
        planProduct: undefined,
        custRiskClassificationId:
          additionalInformation.custRiskClassificationId,
        custRiskClassification: additionalInformation.custRiskClassification,
        naceCodeId: additionalInformation.naceCodeId,
        naceCode: additionalInformation.naceCode,
        amlExemptionId: additionalInformation.amlExemptionId,
        amlExemption: additionalInformation.amlExemption,
        isPep: Boolean(additionalInformation.isPep),
        isFisa: Boolean(additionalInformation.isFisa),
      },
      marketableCustomer: {
        branchOrDigital: ConsentStatus.None,
        marketableCustomer: additionalInformation.marketableCustomer,
        marketableCustomerDateTime: "",
      },
      cbConsent: {
        branchOrDigital: ConsentStatus.None,
        cbConsentAgreed: undefined,
        cbConsentDateTime: "",
      },
    },
    digitalBanking: {
      individualInformation: {
        status: "",
        isMobile: undefined,
        isWeb: undefined,
        channel: "",
        webStatus: "",
        mobileStatus: "",
        registrationType: "",
        package: "",
        packageId: undefined,
        securityElement: "",
        securityElementId: undefined,
        profile: "",
        profileId: undefined,
        userCreated: "",
        userSaved: "",
      },
      businessInformation: {
        status: "",
        isMobile: undefined,
        isWeb: undefined,
        channel: "",
        webStatus: "",
        mobileStatus: "",
      },
      customerInformation: {
        customerNumber: "",
        customerSegment: "",
        name: basicInformation.personalInformation.firstName,
        surname: basicInformation.personalInformation.lastName,
        fatherName: basicInformation.personalInformation.fatherName,
        personalNumber: basicInformation.documentData.ssn,
        mobileNumber:
          typeof basicInformation.contactData.mobileNumber === "string"
            ? basicInformation.contactData.mobileNumber
            : "",
        birthday: basicInformation.personalInformation.birthdate,
        email: basicInformation.contactData.email,
      },
      actions: [],
      applicationStatus: "",
    },
    dueDiligence: {
      employment: {
        employmentTypeId: undefined,
        clientHasManagerialPosition: undefined,
        specify: undefined,
      },
      reasonOfUse: {
        volumeOfUse: undefined,
      },
      sourceOfIncome: {
        sourceFundTypeIds: [],
      },
      bankingProducts: {
        purposeOfBankRelationTypeIds: [],
      },
      cashTransactions: {
        hasCashTransaction: undefined,
        transactionFrequencyId: undefined,
        averageTransactionAmount: undefined,
        currencyIds: [],
        bandId: undefined,
      },
    },
    crs: {
      crsDetails: {
        crsSCDate: "",
        crsCureFlag: undefined,
        crsActionExpireDate: "",
        crsAction: "",
        enhanceReviewDateCrs: "",
        crsStatus: "",
      },
      crsTaxInformation: [],
    },
    fatca: {
      fatcaInformation: {
        documentType: undefined,
        statusDate: additionalInformation.fatcaInformation.statusDate,
        status: undefined,
        documentaryDeadline:
          additionalInformation.fatcaInformation.documentaryDeadline,
        documentaryDate: additionalInformation.fatcaInformation.documentaryDate,
      },
    },
    isValid: undefined,
    actions: [],
    notes: {},
  };
}
