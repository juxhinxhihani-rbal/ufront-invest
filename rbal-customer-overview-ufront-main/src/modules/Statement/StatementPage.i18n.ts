export const statementPageI18n = {
  branch: {
    en: "Branch",
    sq: "Dega",
  },
  user: {
    en: "User",
    sq: "Përdoruesi",
  },
  retailAccountNumber: {
    en: "Retail account number",
    sq: "Numri i llogarisë",
  },
  fromDate: {
    en: "From date",
    sq: "Nga Data",
  },
  toDate: {
    en: "To date",
    sq: "Deri në Datën",
  },
  authorizedPerson: {
    en: "Authorized Person",
    sq: "Personi i autorizuar",
  },
  search: {
    en: "Search",
    sq: "Kërko",
  },
  generateStatement: {
    en: "Generate Statement",
    sq: "Gjenero Statement",
  },
  generateOldStatement: {
    en: "Generate Old Statement",
    sq: "Gjenero Old Statement",
  },
  generateAndSendStatement: {
    en: "Generate/Send Statement",
    sq: "Gjenero/Dërgo Statement",
  },
  failedGenerateStatement: {
    en: "Failed to generate statement",
    sq: "Gjenerimi i statement dështoi",
  },
  generateStatementPleaseWait: {
    en: "Generating statement. Please wait",
    sq: "Po gjenerojmë statement. Ju lutem prisni",
  },
  pleaseWait: {
    en: "Please wait",
    sq: "Ju lutem prisni",
  },
  cantAccessStatement: {
    en: "Statement cannot be accessed from this account.",
    sq: "Nuk mund të aksesohet Statement nga kjo llogari.",
  },
  cantAccessStatementFeature: {
    en: "Statement cannot be accessed at the moment. Please try again later.",
    sq: "Statement nuk mund të aksesohet për momentin. Ju lutem provoni më vonë.",
  },
  cantAccessOldStatementFeature: {
    en: "Old Statement cannot be accessed at the moment. Please try again later.",
    sq: "Old Statement nuk mund të aksesohet për momentin. Ju lutem provoni më vonë.",
  },
  failedGenerateOldStatement: {
    en: "Failed to generate old statement",
    sq: "Gjenerimi i old statement dështoi",
  },
  failedGenerateOldStatementPdf: {
    en: "Failed to generate old statement document",
    sq: "Gjenerimi i dokumentit old statement dështoi",
  },
  table: {
    headers: {
      fromDate: {
        en: "From date",
        sq: "Nga Data",
      },
      toDate: {
        en: "To date",
        sq: "Deri në Datën",
      },
      user: {
        en: "User",
        sq: "Përdoruesi",
      },
      branchCode: { en: "Branch", sq: "Dega" },
      commissionValue: {
        en: "Commission Value",
        sq: "Vlera e Komisionit",
      },
      date: {
        en: "Date",
        sq: "Data",
      },
      withdrewStatement: {
        en: "Withdrew the Statement",
        sq: "Tërhoqi Statement",
      },
    },
    noData: {
      en: "No data found",
      sq: "Nuk u gjet asnjë e dhënë",
    },
  },
  responseMessages: {
    failedToRetrieveDisposableBalance: {
      en: "No available balance found",
      sq: "Nuk u gjet balanca e disponueshme",
    },
    insufficientFunds: {
      en: "The account does not have sufficient funds to charge this statement",
      sq: "Llogaria nuk ka fonde të mjaftueshme për komisionin e këtij statement",
    },
    accountIsClosed: {
      en: "Account is closed",
      sq: "Llogaria është e mbyllur",
    },
    accountInactive: {
      en: "Account is inactive",
      sq: "Llogaria është inaktive",
    },
    postGpiFailed: {
      en: "Statement could not be created",
      sq: "Deklarata nuk mund të krijohet",
    },
    statementGenerationFailed: {
      en: "There was a problem generating this statement. Contact Support",
      sq: "Ndodhi një problem me gjenerimin e këtij statement. Kontaktoni Suportin",
    },
    emailSent: {
      en: "Email sent successfully!",
      sq: "Email u dergua me sukses!",
    },
    pdfGenerated: {
      en: "PDF is generated successfully!",
      sq: "PDF u gjenerua me sukses!",
    },
    accountBlockedDebit: {
      en: "Statement nuk mund të gjenerohet. Llogaria është bllokuar për debt",
      sq: "Statement could not be created. Account is blocked for debt",
    },
    higherStartDate: {
      en: "Choose From Date higher than To Date",
      sq: "Zgjidh Nga Data me të madhe se Deri në Datën",
    },
    higherThanMidasDate: {
      en: "Choose From Date higher than midas date",
      sq: "Zgjidh Nga Data me të madhe se data e midas",
    },
    manualPayment: {
      en: "Please proceed to the counter for manual payment",
      sq: "Ju lutemi vazhdoni në sportel për pagesën manuale",
    },
  },

  validationResponseStatus: {
    customerNotFound: {
      en: "Customer not found!",
      sq: "Klienti nuk u gjet!",
    },
    individualNotFound: {
      en: "Individual not found!",
      sq: "Individi nuk u gjet!",
    },
    pepBlockList: {
      en: "Warning: PEP Blocked Client! You are not allowed to perform any actions",
      sq: "Kujdes, Klient i blokuar PEP! Nuk mund te kryeni veprime",
    },
    missingExpiryDate: {
      en: "Warning: Expiry date is missing! Please update the client's identification document details",
      sq: "Kujdes, Mungon data e skadimit! Azhornoni te dhenat e dokumenti te identifikimit te klientit",
    },
    expiredId: {
      en: "Expired ID! The individual client cannot perform any banking transactions without refreshing their ID and personal details",
      sq: "ID e skaduar! Klienti Individ nuk mund te kryeje veprime ne banke pa rifreskuar ID dhe te dhenat personale",
    },
    deceasedDate: {
      en: "Deceased Date",
      sq: "Data e ndarjes nga jeta",
    },
    nearExpiryId: {
      en: "ID near expiry! Consider refreshing the ID and personal details",
      sq: "Afat ID pranë skadencës! Të shikohet mundësia e rifreskimit te ID dhe të dhënave personale",
    },
    monitoringExpiredBusiness: {
      en: "Periodic Refresh Required! The micro client cannot perform any banking transactions without updating the business details",
      sq: "Rifreskimi periodik! Klienti Mikro nuk mund të kryejë veprime në bankë pa rifreskuar të dhënat e biznesit",
    },
    monitoringExpiredIndividual: {
      en: "Refresh Period Expired! The individual client cannot perform any banking transactions on personal accounts without refreshing personal details",
      sq: "Afat i skaduar rifreskimi! Klienti Individ nuk mund të kryejë veprime në bankë në llogaritë personale pa rifreskuar të dhënat personale",
    },
    monitoringNearExpiryBusiness: {
      en: "Periodic Refresh! Consider the possibility of updating the business details",
      sq: "Rifreskimi periodik! Të shikohet mundesia e rifreskimit të të dhënave të Biznesit",
    },
    monitoringNearExpiryIndividual: {
      en: "Periodic Refresh! Consider updating personal details",
      sq: "Rifreskimi periodik! Të shikohet mundesia e rifreskimit të të dhënave personale",
    },
  },
  statementErrorMessages: {
    errorTitle: {
      en: "Oops!",
      sq: "Oops!",
    },
    goBackButton: {
      en: "Go back",
      sq: "Kthehu",
    },
  },
};
