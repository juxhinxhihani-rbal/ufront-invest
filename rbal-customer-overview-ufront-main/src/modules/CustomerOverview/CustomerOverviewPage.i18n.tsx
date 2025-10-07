export const customerOverviewPageI18n = {
  error: {
    missingResource: {
      title: {
        en: "Oops!",
        sq: "Uups!",
      },
      description: {
        en: (customerId: string) =>
          `Customer with ID: ${customerId} does not exist.`,
        sq: (customerId: string) =>
          `Klienti me ID: ${customerId} nuk ekziston.`,
      },
      button: {
        en: "Go back",
        sq: "Kthehu",
      },
    },
    unsupportedClientType: {
      title: {
        en: "Oops!",
        sq: "Uups!",
      },
      description: {
        en: (customerId: string) =>
          `Customer with ID: ${customerId} is of unsupported type. Customers other than individuals are supported in the older Luka system.`,
        sq: (customerId: string) =>
          `Tipi i klientit me ID ${customerId} nuk suportohet. Ju lutem perdorni sitemin e vjetër LUKA per të tillë klientë.`,
      },
      button: {
        en: "Go back",
        sq: "Kthehu",
      },
    },
    customerNotFound: {
      title: {
        en: "Oops!",
        sq: "Uups!",
      },
      description: {
        en: (customerId: string) =>
          `Customer with ID: ${customerId} was not found!`,
        sq: (customerId: string) => `Klienti me ID ${customerId} nuk u gjet!`,
      },
      button: {
        en: "Go back",
        sq: "Kthehu",
      },
    },
    serverError: {
      title: {
        en: "Oops!",
        sq: "Uups!",
      },
      description: {
        en: "There was some error on our side. Try again later.",
        sq: "Ndodhi një problem nga ana jonë gjat hapjes së aplikacionit. Provoni përsëri më vonë.",
      },
    },
    nrpClosedLongTerm: {
      en: "The bank has no information about this customer! Closed for over 11 years!",
      sq: "Banka nuk ka informacion për këtë klient! Mbi 11 vite i mbyllur!",
    },
  },
};
