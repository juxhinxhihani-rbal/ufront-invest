import { editAdditionalInformationI18n } from "~/components/CustomerModificationForm/components/AdditionalInformation/EditAdditionalInformation.i18n";
import { editCrsDetailsI18n } from "~/components/CustomerModificationForm/components/CRS/components/EditCRSDetails/EditCRSDetails.i18n";
import { editAddressDataI18n } from "~/components/CustomerModificationForm/components/CustomerInformation/components/EditAddressData/EditAddressData.i18n";
import { editContactDataI18n } from "~/components/CustomerModificationForm/components/CustomerInformation/components/EditContactData/EditContactData.i18n";
import { editPersonalDataI18n } from "~/components/CustomerModificationForm/components/CustomerInformation/components/EditPersonalData/EditPersonalData.i18n";
import { editPersonalDocumentDataI18n } from "~/components/CustomerModificationForm/components/CustomerInformation/components/EditPersonalDocumentData/EditPersonalDocumentData.i18n";
import { editPremiumDataI18n } from "~/components/CustomerModificationForm/components/CustomerInformation/components/EditPremiumData/EditPremiumData.i18n";
import { editDueDiligenceI18n } from "~/components/CustomerModificationForm/components/DueDiligence/EditDueDiligence.i18n";
import { editFatcaI18n } from "~/components/CustomerModificationForm/components/Fatca/EditFatca.i18n";

export const editCustomerValuesI18n = {
  default: {
    en: "N/A",
    sq: "N/A",
  },
  prefix: {
    en: "Prefix",
    sq: "Prefix",
  },
  crsTaxInformation: {
    en: "Tax Information",
    sq: "Informacione rreth taksave",
  },
  crsTaxResidenceId: {
    en: "Tax Source",
    sq: "Tax Source",
  },
  residenceTin: {
    en: "TIN",
    sq: "TIN",
  },
  in: {
    en: "in",
    sq: "ne",
  },
  row: {
    en: "row",
    sq: "rrjeshti",
  },
  premiumData: {
    en: "Premium Data",
    sq: "Të dhënat premium",
  },
  customerInformation: {
    en: "Customer Information",
    sq: "Informacioni i Klientit",
  },
  basicInformation: {
    en: "Basic Information",
    sq: "Informacioni Bazë",
  },
  additionalInformation: {
    en: "Additional Information",
    sq: "Informacion Shtesë",
  },
  dueDiligence: {
    en: "Due Diligence",
    sq: "Due Diligence",
  },
  crs: {
    en: "CRS Details",
    sq: "CRS Details",
  },
  fatca: {
    en: "FATCA",
    sq: "FATCA",
  },
  customerSegmentId: {
    en: "Customer Segment",
    sq: "Segmenti i klientit",
  },
  mainSegmentId: {
    en: "Main Segment",
    sq: "Segmenti kryesor",
  },
  countryCodeMobile: {
    en: "Country Code",
    sq: "Kodi i shtetit",
  },
  isPhoneNumberVerified: {
    en: "Phone verified",
    sq: "Nr i celit i verifikuar",
  },
  premiumServiceId: {
    en: "Service",
    sq: "Shërbimi",
  },
  ...editPersonalDataI18n,
  ...editAddressDataI18n,
  ...editPersonalDocumentDataI18n,
  ...editContactDataI18n,
  ...editPremiumDataI18n,
  ...editAdditionalInformationI18n,
  ...editDueDiligenceI18n,
  ...editCrsDetailsI18n,
  ...editFatcaI18n,
};
