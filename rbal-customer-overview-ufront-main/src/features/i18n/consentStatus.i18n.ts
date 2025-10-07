import { ConsentStatus } from "~/api/customer/customerApi.types";

export const consentStatusI18n = {
  [ConsentStatus.BranchYes]: {
    en: "Branch Yes",
    sq: "Banke Po",
  },
  [ConsentStatus.BranchNo]: {
    en: "Branch No",
    sq: "Banke Jo",
  },
  [ConsentStatus.DigitalYes]: {
    en: "Digital Yes",
    sq: "Dixhital Po",
  },
  [ConsentStatus.DigitalNo]: {
    en: "Digital No",
    sq: "Dixhital Jo",
  },
  [ConsentStatus.None]: {
    en: "None",
    sq: "Asnje",
  },
};
