export const customerListingPageI18n = {
  title: {
    en: "Search customers",
    sq: "Kërko klientët",
  },
  goBack: {
    en: "Back",
    sq: "Kthehu",
  },
  idle: {
    title: {
      en: "Enter the search parameters",
      sq: "Vendosni parametrat e kërkimit",
    },
    description: {
      en: "Put your query in the form above so we will do the rest",
      sq: "Vendosni kërkesën tuaj në formularin e mësipërm dhe ne do të bëjmë pjesën tjetër",
    },
  },
  resultsNotFound: {
    title: {
      en: "There are no customers matching your criteria",
      sq: "Nuk ka asnjë rezultat që përputhet",
    },
    description: {
      en: "Try removing some filters",
      sq: "Provo te pakësosh filtrat",
    },
  },
  error: {
    title: {
      en: "Sorry, something went wrong ",
      sq: "Na vjen keq, ndodhi nje gabim",
    },
    description: {
      en: "Please wait a minute until you try again. Your data is safe.",
      sq: "Ju lutem prisni një minutë para se ta provoni përsëri. Të dhënat tuaja janë të sigurta.",
    },
  },
  listing: {
    headers: {
      branchCode: { en: "Branch", sq: "Dega" },
      ssn: { en: "SSN", sq: "SSN" },
      fullName: {
        en: "Name / Father's Name / Last Name",
        sq: "Emri / Emri Babait / Mbiemri",
      },
      birthDate: { en: "Birth Date", sq: "Datëlindja" },
      birthPlace: { en: "Birth Place", sq: "Vendlindja" },
      nipt: { en: "NIPT", sq: "NIPT" },
      status: { en: "Status", sq: "Statusi" },
      lukaSignatureStatus: {
        en: "Signature",
        sq: "Nënshkrimi",
      },
    },
    walkinCustomerHeader: {
      en: "Walk-in customers",
      sq: "Klientët Walk-in",
    },
    subRows: {
      customerNumber: {
        en: "Customer No.",
        sq: "Numri i klientit",
      },
      documentNumber: {
        en: "Document number",
        sq: "Numri i dokumentit",
      },
      lastSavedDate: {
        en: "Last saved date",
        sq: "Data e fundit e ruajtjes",
      },
      screenDate: {
        en: "Screen Date",
        sq: "Data e kontrollit",
      },
      lukaId: {
        en: "Luka ID",
        sq: "Luka ID",
      },
    },
    caption: {
      en: (totalCount: number) => `Found ${totalCount} results`,
      sq: (totalCount: number) => `U gjetën ${totalCount} rezultate`,
    },
  },
  nrpClosedLongTerm: {
    en: "The bank has no information about this customer! Closed for over 11 years!",
    sq: "Banka nuk ka informacion për këtë klient! Mbi 11 vite i mbyllur!",
  },

  buttons: {
    downloadDocs: {
      en: "Download the documents",
      sq: "Shkarkoni dokumentat",
    },
    recentTransactions: {
      en: "Lookup recent transactions",
      sq: "Kërkoni transaksionet e fundit",
    },
  },
};
