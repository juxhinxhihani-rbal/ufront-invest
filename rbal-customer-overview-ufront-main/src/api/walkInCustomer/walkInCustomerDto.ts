import { format } from "date-fns";
import { Country, FatcaStatusType } from "~/modules/EditCustomer/types";
import {
  CreateWalkInCustomerDto,
  WalkInCustomerDto,
  WalkInCustomerResponseDto,
} from "./walkInCustomerApi.types";

export const toWalkInCustomerItem = (
  data: WalkInCustomerResponseDto
): WalkInCustomerDto => {
  return {
    ...data,
    basicInformation: {
      personalInformation: {
        ...data.personalInformation,
        birthdate: data.personalInformation.birthdate
          ? format(new Date(data.personalInformation.birthdate), "yyyy-MM-dd")
          : "",
      },
      addressInformation: data.addressInformation ?? {},
      contactData: data.contactData ?? {},
      amlInformation: data.amlInformation ?? {},
      documentData: {
        ...data.documentData,
        issueDate: data.documentData.issueDate
          ? format(new Date(data.documentData.issueDate), "yyyy-MM-dd")
          : "",
        expiryDate: data.documentData.expiryDate
          ? format(new Date(data.documentData.expiryDate), "yyyy-MM-dd")
          : "",
      },
    },
    additionalInformation: {
      ...data.additionalInformation,
      fatcaInformation: {
        ...data.additionalInformation.fatcaInformation,
        statusDate: data.additionalInformation.fatcaInformation?.statusDate
          ? format(
              new Date(data.additionalInformation.fatcaInformation.statusDate),
              "yyyy-MM-dd"
            )
          : "",
        documentaryDeadline: data.additionalInformation.fatcaInformation
          ?.documentaryDeadline
          ? format(
              new Date(
                data.additionalInformation.fatcaInformation.documentaryDeadline
              ),
              "yyyy-MM-dd"
            )
          : "",
        documentaryDate: data.additionalInformation.fatcaInformation
          ?.documentaryDate
          ? format(
              new Date(
                data.additionalInformation.fatcaInformation.documentaryDate
              ),
              "yyyy-MM-dd"
            )
          : "",
      },
      alternativeAddress: data.additionalInformation.alternativeAddress ?? {},
      employmentData: data.additionalInformation.employmentData ?? {},
    },
  };
};

export const mapCreateWalkInCustomerFormToCreateWalkInCustomerDTO = (
  data: WalkInCustomerDto
): CreateWalkInCustomerDto => {
  const isAlbanianNationality =
    data.basicInformation?.personalInformation.nationalityId == Country.Albania;
  return {
    personalInformation: {
      firstName: data.basicInformation?.personalInformation?.firstName,
      lastName: data.basicInformation?.personalInformation?.lastName,
      fatherName: data.basicInformation?.personalInformation?.fatherName,
      motherName: data.basicInformation?.personalInformation?.motherName,
      birthdate: data.basicInformation?.personalInformation?.birthdate,
      countryOfBirthId:
        data.basicInformation?.personalInformation?.countryOfBirthId,
      birthplace: data.basicInformation?.personalInformation?.birthplace,
      genderId: data.basicInformation?.personalInformation?.genderId,
      martialStatusId:
        data.basicInformation?.personalInformation?.martialStatusId,
      maidenName: data.basicInformation?.personalInformation?.maidenName,
      nationalityId: data.basicInformation?.personalInformation?.nationalityId,
    },
    addressInformation: {
      address: data.basicInformation?.addressInformation?.address,
      countryId: data.basicInformation?.addressInformation?.countryId,
      cityId: data.basicInformation?.addressInformation?.cityId,
    },
    contactData: {
      mobileNumber: data.basicInformation?.contactData?.mobileNumber,
      alternativeMobileNumber:
        data.basicInformation?.contactData?.alternativeMobileNumber,
      email: data.basicInformation?.contactData?.email,
      isEmailValidated: Boolean(
        data.basicInformation?.contactData?.isEmailValidated
      ),
    },
    documentData: {
      ssn: data.basicInformation?.documentData?.ssn,
      typeId: data.basicInformation?.documentData?.typeId,
      issuerId: data.basicInformation?.documentData?.issuerId,
      issueDate: data.basicInformation?.documentData?.issueDate,
      number: data.basicInformation?.documentData?.number,
      expiryDate: data.basicInformation?.documentData?.expiryDate,
      isSsnNotRegularFormat: isAlbanianNationality
        ? Boolean(data.basicInformation?.documentData?.isSsnNotRegularFormat)
        : true,
    },
    amlInformation: {
      educationLevelId: data.basicInformation?.amlInformation?.educationLevelId,
      overallRiskRating:
        data.basicInformation?.amlInformation?.overallRiskRating,
      deathDate: data.basicInformation?.amlInformation?.deathDate,
    },
    additionalInformation: {
      adittionalAdress: {
        residentialAddress:
          data.additionalInformation?.alternativeAddress?.residentialAddress,
        countryResidenceId:
          data.additionalInformation?.alternativeAddress?.countryResidenceId,
        citizenshipId:
          data.additionalInformation?.alternativeAddress?.citizenshipId,
        cityResidenceId:
          data.additionalInformation?.alternativeAddress?.cityResidenceId,
        stateOfTaxPaymentId:
          data.additionalInformation?.alternativeAddress?.stateOfTaxPaymentId,
      },
      employment: {
        professionId: data.additionalInformation?.employmentData?.professionId,
        dicasteryId: data.additionalInformation?.employmentData?.dicasteryId,
        ministryId: data.additionalInformation?.employmentData?.ministryId,
      },
      fatcaInformation: {
        fatcaStatus:
          data.additionalInformation?.fatcaInformation?.fatcaStatus ??
          FatcaStatusType.NotClassified,
        statusDate: data.additionalInformation?.fatcaInformation?.statusDate,
        documentaryDeadline:
          data.additionalInformation?.fatcaInformation?.documentaryDeadline,
        documentaryDate:
          data.additionalInformation?.fatcaInformation?.documentaryDate,
      },
      marketableCustomer: data.additionalInformation?.marketableCustomer,
    },
  };
};
