import { WalkInCustomerPersonalInformationDto } from "~/api/walkInCustomer/walkInCustomerApi.types";

export const getPersonalInfoObject = (
  personalInfo: WalkInCustomerPersonalInformationDto | undefined
) => {
  return {
    firstName: personalInfo?.firstName,
    lastName: personalInfo?.lastName,
    fatherName: personalInfo?.fatherName,
    motherName: personalInfo?.motherName,
    birthdate: personalInfo?.birthdate,
    birthplace: personalInfo?.birthplace,
    nationalityId: personalInfo?.nationalityId,
    countryOfBirthId: personalInfo?.countryOfBirthId,
    genderId: personalInfo?.genderId,
    martialStatusId: personalInfo?.martialStatusId,
    maidenName: personalInfo?.maidenName,
  };
};
