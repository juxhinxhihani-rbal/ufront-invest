export const retailAccountsI18n = {
  title: {
    en: "Retail Accounts",
    sq: "Llogaritë Retail",
  },
  warningText: {
    en: "The customer does not have any retail accounts.",
    sq: "Klienti nuk ka llogari retail.",
  },
  errorTitle: {
    en: "Oops!",
    sq: "Oops!",
  },
  errorDescription: {
    en: "There was an error on our side loading retail accounts.",
    sq: "Ndodhi një problem teknik gjatë ngarkimit të llogarive retail.",
  },
  errorRefresh: {
    en: "Refresh",
    sq: "Rifresko",
  },
  balances: {
    timeout: {
      description: {
        en: "It took too long to load the account balances. Please try again. The funds are safe.",
        // TODO: Generated with Google translate, fixme
        sq: "U desh shumë kohë për të ngarkuar gjendjet e llogarisë. Ju lutemi provoni përsëri. Fondet janë të sigurta.",
      },
    },
    error: {
      description: {
        en: "There was an error on our side while loading the account balances. Please try again later. The funds are safe.",
        // TODO: Generated with Google translate, fixme
        sq: "Pati një gabim nga ana jonë gjatë ngarkimit të gjendjeve të llogarisë. Ju lutemi provoni sërish më vonë. Fondet janë të sigurta.",
      },
    },
  },
  createAccount: {
    en: "Create new account",
    sq: "Krijo një llogari të re",
  },
  intelligentBanking: {
    en: "Intelligent Banking",
    sq: "Bankimi Inteligjent",
  },
  loadBalances: {
    en: (missingBalances: number) => `Load balances (${missingBalances})`,
    sq: (missingBalances: number) => `Merr balancën (${missingBalances})`,
  },
};
