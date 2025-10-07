import { CustomerStatus } from "~/api/customer/customerApi.types";

export const customerStatusI18n = {
  [CustomerStatus.Active]: {
    en: "Active",
    sq: "Aktiv",
  },
  [CustomerStatus.Inactive]: {
    en: "Inactive",
    sq: "Joaktiv",
  },
  [CustomerStatus.OnHold]: {
    en: "On hold",
    sq: "Në pritje",
  },
  [CustomerStatus.WaitingForApproval]: {
    en: "Waiting for approval",
    sq: "Në pritje për aprovim",
  },
};
