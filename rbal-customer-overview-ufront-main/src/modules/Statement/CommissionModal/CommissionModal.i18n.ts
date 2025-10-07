export const commissionModalI18n = {
  commissionResponseModalTitle: {
    en: "The account will be commissioned",
    sq: "Llogaria do komisionohet",
  },
  commissionForOldResponse: {
    en: "This statement",
    sq: "Ky statement",
  },
  commissionResponseNumberOfStatement: {
    en: (numberOfStatement: number) =>
      `This is statement number ${numberOfStatement} for this period and `,
    sq: (numberOfStatement: number) =>
      `Ky është statement i ${numberOfStatement} për këtë periudhë dhe `,
  },
  commissionResponseCommission: {
    en: (commission: number) =>
      `will be charged with the value of ${commission} `,
    sq: (commission: number) => `do komisionohet me vlerën ${commission} `,
  },
  commissionResponseCurrency: {
    en: (currency: string) => `${currency}. Do you want to continue?`,
    sq: (currency: string) => `${currency}. Doni te vazhdoni ?`,
  },
  pleaseWait: {
    en: "Processing Commision. Please wait",
    sq: "Po procesojmë komisionimin. Ju lutem prisni",
  },
};
