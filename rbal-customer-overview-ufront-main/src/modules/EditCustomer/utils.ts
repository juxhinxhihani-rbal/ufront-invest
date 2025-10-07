import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";
import {
  CountryCode,
  CrsDto,
  CrsTaxInformationDto,
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
  CustomerInformationDto,
  PersonalInfoDto,
} from "~/api/customer/customerApi.types";
import { Country, PersonalDocumentType } from "~/modules/EditCustomer/types";
import { showInfo } from "~/components/Toast/ToastContainer";

interface FlattenedObject {
  name: string;
  value: string;
}

export interface FatcaUsIndicia {
  nationalityId?: number;
  documentTypeId?: number;
  birthCountryId?: number | null;
  livingCountryId?: number;
  mobileCountryCode?: string;
  crsTaxInformation?: CrsTaxInformationDto[];
  countryOfResidenceId?: number | null;
}

export interface UsaIndicaCustomers {
  customer: CustomerDto | undefined;
  authorizedPersons: CustomerAuthorizedPersonsResponse[] | undefined;
}

export const getChangedDataAsObject = (
  data?: CreateRetailAccountResponse
): FlattenedObject[] => {
  let result: FlattenedObject[] = [];

  let key: keyof CreateRetailAccountResponse;
  const assertedData = data as CreateRetailAccountResponse;

  delete assertedData?.customerStatusId;

  for (key in assertedData) {
    if (Object.prototype.hasOwnProperty.call(assertedData, key)) {
      if (typeof assertedData[key] === "object" && assertedData[key] !== null) {
        result = result.concat(
          getChangedDataAsObject(
            assertedData[key] as unknown as CreateRetailAccountResponse
          )
        );
      } else {
        result.push({
          name: key[0].toLowerCase() + key.substring(1),
          value: assertedData[key]?.toString() ?? "",
        });
      }
    }
  }

  return result;
};

const getCountriesFromTaxInformation = (data: CrsTaxInformationDto[] = []) => {
  const countryIds = data.map((item) => item.countryId);
  return countryIds;
};

export const isFatcaActive = ({
  nationalityId,
  documentTypeId,
  birthCountryId,
  livingCountryId,
  mobileCountryCode,
  crsTaxInformation,
  countryOfResidenceId,
}: FatcaUsIndicia) => {
  //TODO: We should add also alternative mobile number.
  const taxInformationCountryIds =
    getCountriesFromTaxInformation(crsTaxInformation);
  return (
    nationalityId === Country.Usa ||
    documentTypeId === PersonalDocumentType.UsGreenCard ||
    birthCountryId === Country.Usa ||
    livingCountryId === Country.Usa ||
    mobileCountryCode === CountryCode.Usa ||
    taxInformationCountryIds.includes(Country.Usa) ||
    countryOfResidenceId === Country.Usa
  );
};

export const getFatcaUsIndiciaObject = (
  customerInformation: CustomerInformationDto | undefined,
  crs: CrsDto | undefined
): FatcaUsIndicia => {
  return {
    nationalityId: customerInformation?.personalInfo?.nationalityId,
    birthCountryId: customerInformation?.personalInfo?.countryOfBirthId,
    documentTypeId: customerInformation?.document?.typeId,
    livingCountryId: customerInformation?.address?.countryId,
    mobileCountryCode: customerInformation?.contact?.countryCodeMobile,
    crsTaxInformation: crs?.crsTaxInformation,
    countryOfResidenceId:
      customerInformation?.personalInfo?.countryOfResidenceId,
  };
};

export const getPersonalInfoObject = (
  personalInfo: PersonalInfoDto | undefined
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
    additionalLastName: personalInfo?.additionalLastName,
    isSalaryReceivedAtRbal: personalInfo?.isSalaryReceivedAtRbal,
    isRial: personalInfo?.isRial,
  };
};

interface FatcaUsIndiciaNotification {
  newValue: string | number | undefined;
  indicia: PersonalDocumentType | Country | CountryCode;
  message?: string;
  currentValue?: string | number;
}

interface CrsNotification {
  isCreateMode: boolean;
  newValue: number | undefined;
  nationalityId?: number | undefined;
  countryId?: number | undefined;
  countryMobileId?: number | undefined;
}

interface CrsAndFatcaNotification {
  fatcaUsIndica: FatcaUsIndiciaNotification;
  crsNotification: CrsNotification;
  message: {
    fatcaMessage: string;
    crsMessage: string;
    crsAndFatcaMessage: string;
  };
}

export const shouldshowFatcaNotification = (
  data: FatcaUsIndiciaNotification
) => {
  const { newValue, indicia, currentValue } = data;
  const hasCurrentValue = !!currentValue;
  if (
    newValue === indicia &&
    (hasCurrentValue ? currentValue !== indicia : true)
  ) {
    return true;
  }
  return false;
};

export const fatcaUsIndiciaNotification = (
  data: FatcaUsIndiciaNotification
) => {
  const { message } = data;
  const shouldShowNotificaiton = shouldshowFatcaNotification(data);
  if (shouldShowNotificaiton) {
    showInfo(message);
  }
};

export const shouldShowCrsNotification = (data: CrsNotification) => {
  const { isCreateMode, nationalityId, countryId, countryMobileId, newValue } =
    data;
  const values = [nationalityId, countryId, countryMobileId];
  if (isCreateMode) {
    const filledFields = values.filter((value) => value !== undefined);
    return filledFields.length && !values.includes(newValue);
  }
  return !values.includes(newValue);
};

export const showCrsAndFatcaNotification = (data: CrsAndFatcaNotification) => {
  const { fatcaUsIndica, message, crsNotification } = data;
  const showFatcaNotification = shouldshowFatcaNotification(fatcaUsIndica);
  const showCrsNotification = shouldShowCrsNotification(crsNotification);
  switch (true) {
    case showCrsNotification && showFatcaNotification:
      showInfo(message.crsAndFatcaMessage);
      break;
    case showFatcaNotification:
      fatcaUsIndiciaNotification({
        ...fatcaUsIndica,
        message: message.fatcaMessage,
      });
      break;
    case showCrsNotification:
      showInfo(message.crsMessage);
      break;
    default:
      break;
  }
};

export const hasUsaIndica = (customer?: CustomerDto) => {
  if (!customer) {
    return false;
  }

  const { customerInformation, crs } = customer;

  const factaUsIndica = getFatcaUsIndiciaObject(customerInformation, crs);

  return isFatcaActive(factaUsIndica);
};

export const hasAtLeastOneUsaIndicaPerson = ({
  customer,
  authorizedPersons = [],
}: UsaIndicaCustomers) => {
  const isUsaIndicaCustomer = hasUsaIndica(customer);
  const hasUsaIndicaAuthorizedPersons = authorizedPersons?.some((person) =>
    hasUsaIndica(person as unknown as CustomerDto)
  );

  return isUsaIndicaCustomer || hasUsaIndicaAuthorizedPersons;
};
